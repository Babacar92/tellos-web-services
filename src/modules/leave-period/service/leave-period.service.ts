import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { LeavePeriodCreateArgInput } from '../dto/args/leave-period.create.arg.input';
import { LeavePeriodFilterArgInput } from '../dto/args/leave-period.filter.arg.input';
import { LeavePeriodRemoveArgInput } from '../dto/args/leave-period.remove.arg.input';
import { LeavePeriodUpdateArgInput } from '../dto/args/leave-period.update.arg.input';
import { LeavePeriodPaginationResultInterface } from '../dto/interfaces/leave-period.pagination.result.interface';
import { LEAVE_PERIOD_PROVIDERS_NAMES } from '../dto/provider/leave-period.providers';
import { LeavePeriodEntity } from 'src/entities/psql/LeavePeriodEntity';
import { LeavePeriodLogger } from '../logger/leave-period.logger';

@Injectable()
export class LeavePeriodService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ["id", "lp.id"],
        ["employee", "emp.id"],
        ["employeeId", "emp.id"],
        ["dateFrom", "lp.dateFrom"],
        ["dateTo", "lp.dateTo"],
        ["countAcquiredLeave", "lp.countAcquiredLeave"],
        ["countUsableLeave", "lp.countUsableLeave"],
        ["active", "lp.active"],
        ["createdAt", "lp.createdAt"],
        ["updatedAt", "lp.updatedAt"],
        ["deletedAt", "lp.deletedAt"],
        ["createdBy", "lp.createdBy"],
        ["updatedBy", "lp.updatedBy"],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(LEAVE_PERIOD_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<LeavePeriodEntity>,
        private readonly _logger: LeavePeriodLogger,
    ) {
        super();
    }

    /**
     * Check if Quick Access Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | LeavePeriodEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof LeavePeriodEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found Quick Access by column search and is value
     * @param value 
     * @param column 
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @returns 
     */
    public async existByColumn(
        value: any,
        column: string,
        id?: number | LeavePeriodEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof LeavePeriodEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('lp', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (LeavePeriodEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
            }

            if (id > 0 && column !== "id") qb.andWhere(`${this._cn('id')} != :column_id`, { column_id: id });

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    /**
     * Return all quick access
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: LeavePeriodFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeavePeriodEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }

    /**
     * Return data with pagination
     * @param sort 
     * @param pagination 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findLeavePeriodsAndPaginationAll(
        filter: LeavePeriodFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeavePeriodPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one quick access by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | LeavePeriodEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeavePeriodEntity> {
        if (id instanceof LeavePeriodEntity) id = id.id;
        return this.findByColumn("id", id, repo, manager);
    }

    /**
     * Return an existing user by his column value
     * @param column 
     * @param value 
     * @param repo 
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeavePeriodEntity> {
        const qb = this._initSelect(repo, manager);

        if (LeavePeriodEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Leave
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: LeavePeriodCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeavePeriodEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Leave
            const newLeavePeriod = new LeavePeriodEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(newLeavePeriod, rest);

            // Save hit
            const result = await transaction.save(newLeavePeriod);

            if (result) {
                this._logger.create(newLeavePeriod);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Leave
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: LeavePeriodUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeavePeriodEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldLeavePeriod = await this.findOne(id, repo, transaction);

            if (oldLeavePeriod) {
                // Set old data
                this._logger.setOldData(oldLeavePeriod);

                // Add new Data
                Object.assign(oldLeavePeriod, req);

                // Save Data
                const result = await transaction.save(oldLeavePeriod);

                if (result) {
                    this._logger.update(oldLeavePeriod);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing entity
     * @param updateEntity 
     * @param repo 
     * @returns
     */
    public async remove(
        req: LeavePeriodRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof LeavePeriodEntity ? id.id : id;
                const LeavePeriod = await this.findOne(id, repo, transaction);

                if (LeavePeriod instanceof LeavePeriodEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(LeavePeriodEntity, LeavePeriod.id);

                        this._logger.delete(LeavePeriod);
                    } else {
                        await transaction.softDelete(LeavePeriodEntity, LeavePeriod.id);

                        this._logger.softDelete(LeavePeriod);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, (manager || repo));
    }

    /**
     * Init Select Query Builder
     * @param repo 
     * @returns 
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<LeavePeriodEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('lp', manager?.queryRunner)
            .leftJoinAndSelect('lp.employee', 'emp')
            .leftJoinAndSelect('emp.picture', 'picture')
            .leftJoinAndSelect('emp.login', 'login');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<LeavePeriodEntity>,
        filter?: LeavePeriodFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('dateFrom')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('dateTo')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('countUsableLeave')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('countAcquiredLeave')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.dateFrom) qb.andWhere(`${this._cn('dateFrom')} ILIKE :dateFrom`, { dateFrom: `%${filter.dateFrom}%` });

            if (filter.dateTo) qb.andWhere(`${this._cn('dateTo')} ILIKE :dateTo`, { dateTo: `%${filter.dateTo}%` });

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeIds')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<LeavePeriodEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return LeavePeriodService.ColumnQueryNames.get(columnName);
    }

}
