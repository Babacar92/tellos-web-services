import { Inject, Injectable } from '@nestjs/common';
import { LeaveDistributionEntity } from 'src/entities/psql/LeaveDistributionEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { LeaveDistributionCreateArgInput } from '../dto/args/leave-distribution.create.arg.input';
import { LeaveDistributionFilterArgInput } from '../dto/args/leave-distribution.filter.arg.input';
import { LeaveDistributionRemoveArgInput } from '../dto/args/leave-distribution.remove.arg.input';
import { LeaveDistributionUpdateArgInput } from '../dto/args/leave-distribution.update.arg.input';
import { LeaveDistributionPaginationResultInterface } from '../dto/interfaces/leave-distribution.pagination.result.interface';
import { LEAVE_DISTRIBUTION_PROVIDERS_NAMES } from '../dto/provider/leave-distribution.providers';
import { LeaveEntity } from 'src/entities/psql/LeaveEntity';
import { LeaveDistributionLogger } from '../logger/leave-distribution.logger';

@Injectable()
export class LeaveDistributionService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'ld.id'],
        ['name', 'ld.name'],
        ['total', 'ld.total'],
        ['leaveId', 'l.id'],
        ['leave', 'l.id'],
        ['leave.entity', 'l.entity'],
        ['leave.gender', 'l.gender'],
        ['leave.contract', 'l.contract'],
        ['leave.decision', 'l.decision'],
        ['leave.startDate', 'l.startDate'],
        ['leave.endDate', 'l.endDate'],
        ['leave.startDay', 'l.startDay'],
        ['leave.endDay', 'l.endDay'],
        ['leave.motive', 'l.motive'],
        ['active', 'qt.active'],
        ['createdAt', 'qt.createdAt'],
        ['updatedAt', 'qt.updatedAt'],
        ['deletedAt', 'qt.deletedAt'],
        ['createdBy', 'qt.createdBy'],
        ['updatedBy', 'qt.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(LEAVE_DISTRIBUTION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<LeaveDistributionEntity>,
        private readonly _logger: LeaveDistributionLogger,
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
        id?: number | LeaveDistributionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof LeaveDistributionEntity) id = id.id;

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
        id?: number | LeaveDistributionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof LeaveDistributionEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('ld', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (LeaveDistributionEntity.isColumnString(column)) {
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
        filter?: LeaveDistributionFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveDistributionEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }



    /**
     * Save multiple Leave Distribution
     * @param types
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async saveMultipleLeaveDistribution(
        types: LeaveDistributionEntity[],
        repo?: string,
        manager?: EntityManager,
        leave?: LeaveEntity
    ): Promise<LeaveDistributionEntity[] | any> {
        return new Promise(async (resolve, reject) => {
            const savedLeaveDistributions = [];

            for (const i in types) {
                // types.leave = new LeaveEntity({id: leave.id})
                const type = types[i];

                savedLeaveDistributions.push(await this.saveLeaveDistribution(type, repo, manager));

            }
            resolve(savedLeaveDistributions);
        });
    }

    /**
     * Save a Leave Distribution
     * @param type
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async saveLeaveDistribution(
        types?: LeaveDistributionEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveDistributionEntity[] | any> {
        return new Promise(async (resolve) => {
            if (types) {
                const result = await this._saveNewLeaveDistribution({
                    name: types.name,
                    total: types.total,
                }, repo, manager);

                resolve(result);
            } else {
                resolve({
                    error: {
                        message: 'No Leave Distribution save',
                    }
                });
            }
        });
    }

    /**
     * Save a new Leave Distribution
     * @param type
     * @param leave
     * @param repo 
     * @param manager 
     * @returns 
     */
    private _saveNewLeaveDistribution(
        type?: { name: any, total: number, },
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveDistributionEntity | any> {
        return this.useTransaction(async transaction => {
            if (type) {

                // Create new Upload
                const newUpload = new LeaveDistributionEntity({
                    active: true,

                });

                // newUpload.leave = LeaveEntity(id)
                newUpload.name = type.name;
                newUpload.total = type.total

                // Save new upload
                const savedUpload = await transaction.save(newUpload);


                if (savedUpload) {
                    return this.findOne(savedUpload.id, repo, transaction);
                }
            } else {
                return {
                    error: {
                        message: 'No Leave Distribution save',
                    }
                };
            }
        }, (manager || repo));
    }


    /**
     * Return data with pagination
     * @param sort 
     * @param pagination 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findLeaveDistributionAndPaginationAll(
        filter: LeaveDistributionFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveDistributionPaginationResultInterface> {
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
        id: number | LeaveDistributionEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveDistributionEntity> {
        if (id instanceof LeaveDistributionEntity) id = id.id;
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
    ): Promise<LeaveDistributionEntity> {
        const qb = this._initSelect(repo, manager);

        if (LeaveDistributionEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: LeaveDistributionCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveDistributionEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const leaveDistribution = new LeaveDistributionEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(leaveDistribution, rest);

            // Save hit
            const result = await transaction.save(leaveDistribution);

            if (result) {
                this._logger.create(leaveDistribution);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Quick Access
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: LeaveDistributionUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveDistributionEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldLeaveDistribution = await this.findOne(id, repo, transaction);

            if (oldLeaveDistribution) {
                // Set old data
                this._logger.setOldData(oldLeaveDistribution);

                // Add new Data
                Object.assign(oldLeaveDistribution, req);

                // Save Data
                const result = await transaction.save(oldLeaveDistribution);

                if (result) {
                    this._logger.update(oldLeaveDistribution);

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
        req: LeaveDistributionRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof LeaveDistributionEntity ? id.id : id;
                const leaveDistribution = await this.findOne(id, repo, transaction);

                if (leaveDistribution instanceof LeaveDistributionEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(LeaveDistributionEntity, leaveDistribution.id);

                        this._logger.delete(leaveDistribution);
                    } else {
                        await transaction.softDelete(LeaveDistributionEntity, leaveDistribution.id);

                        this._logger.softDelete(leaveDistribution);
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
    ): SelectQueryBuilder<LeaveDistributionEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('ld', manager?.queryRunner)
            .leftJoinAndSelect('ld.leave', 'l')
            .leftJoinAndSelect('l.employee', 'emp')
            .leftJoinAndSelect('l.service', 's')


        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<LeaveDistributionEntity>,
        filter?: LeaveDistributionFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('name')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.name) qb.andWhere(`${this._cn('name')} ILIKE :name`, { name: `%${filter.name}%` });

            if (filter.names?.length) qb.andWhere(`${this._cn('name')} IN (:...names)`, { names: filter.names });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<LeaveDistributionEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return LeaveDistributionService.ColumnQueryNames.get(columnName);
    }

}
