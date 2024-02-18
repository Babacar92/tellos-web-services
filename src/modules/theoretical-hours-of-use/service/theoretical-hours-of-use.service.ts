import { Inject, Injectable } from '@nestjs/common';
import { TheoreticalHoursOfUseEntity } from 'src/entities/psql/TheoreticalHoursOfUseEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { TheoreticalHoursOfUseCreateArgInput } from '../dto/args/theoretical-hours-of-use.create.arg.input';
import { TheoreticalHoursOfUseFilterArgInput } from '../dto/args/theoretical-hours-of-use.filter.arg.input';
import { TheoreticalHoursOfUseRemoveArgInput } from '../dto/args/theoretical-hours-of-use.remove.arg.input';
import { TheoreticalHoursOfUseUpdateArgInput } from '../dto/args/theoretical-hours-of-use.update.arg.input';
import { TheoreticalHoursOfUsePaginationResultInterface } from '../dto/interfaces/theoretical-hours-of-use.pagination.result.interface';
import { THEORETICAL_HOURS_OF_USE_PROVIDERS_NAMES } from '../dto/provider/theoretical-hours-of-use.providers';
import { TheoreticalHoursOfUseLogger } from '../logger/theoretical-hours-of-use.logger';

@Injectable()
export class TheoreticalHoursOfUseService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'qn.id'],
        ['year', 'qn.year'],
        ['hoursNumber', 'qn.hoursNumber'],
        ['active', 'qn.active'],
        ['createdAt', 'qn.createdAt'],
        ['updatedAt', 'qn.updatedAt'],
        ['deletedAt', 'qn.deletedAt'],
        ['createdBy', 'qn.createdBy'],
        ['updatedBy', 'qn.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(THEORETICAL_HOURS_OF_USE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<TheoreticalHoursOfUseEntity>,
        private readonly _logger: TheoreticalHoursOfUseLogger,
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
        id?: number | TheoreticalHoursOfUseEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof TheoreticalHoursOfUseEntity) id = id.id;

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
        id?: number | TheoreticalHoursOfUseEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof TheoreticalHoursOfUseEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('qn', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (TheoreticalHoursOfUseEntity.isColumnString(column)) {
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
        filter?: TheoreticalHoursOfUseFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<TheoreticalHoursOfUseEntity[]> {
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
    public async findTheoreticalHoursOfUsesAndPaginationAll(
        filter: TheoreticalHoursOfUseFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<TheoreticalHoursOfUsePaginationResultInterface> {
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
        id: number | TheoreticalHoursOfUseEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<TheoreticalHoursOfUseEntity> {
        if (id instanceof TheoreticalHoursOfUseEntity) id = id.id;
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
    ): Promise<TheoreticalHoursOfUseEntity> {
        const qb = this._initSelect(repo, manager);

        if (TheoreticalHoursOfUseEntity.isColumnString(column)) {
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
        data: TheoreticalHoursOfUseCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<TheoreticalHoursOfUseEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const theoreticalHoursOfUse = new TheoreticalHoursOfUseEntity();

            // Set Data
            Object.assign(theoreticalHoursOfUse, data);

            // Save hit
            const result = await transaction.save(theoreticalHoursOfUse);

            if (result) {
                this._logger.create(theoreticalHoursOfUse);

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
        data: TheoreticalHoursOfUseUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<TheoreticalHoursOfUseEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldTheoreticalHoursOfUse = await this.findOne(id, repo, transaction);

            if (oldTheoreticalHoursOfUse) {
                // Set old data
                this._logger.setOldData(oldTheoreticalHoursOfUse);

                // Add new Data
                Object.assign(oldTheoreticalHoursOfUse, req);

                // Save Data
                const result = await transaction.save(oldTheoreticalHoursOfUse);

                if (result) {
                    this._logger.update(oldTheoreticalHoursOfUse);

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
        req: TheoreticalHoursOfUseRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof TheoreticalHoursOfUseEntity ? id.id : id;
                const qualificationName = await this.findOne(id, repo, transaction);

                if (qualificationName instanceof TheoreticalHoursOfUseEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(TheoreticalHoursOfUseEntity, qualificationName.id);

                        this._logger.delete(qualificationName);
                    } else {
                        await transaction.softDelete(TheoreticalHoursOfUseEntity, qualificationName.id);

                        this._logger.softDelete(qualificationName);
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
    ): SelectQueryBuilder<TheoreticalHoursOfUseEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('qn', manager?.queryRunner)

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<TheoreticalHoursOfUseEntity>,
        filter?: TheoreticalHoursOfUseFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('year')} ILIKE :search)`, { search: `%${filter.search}%` });

                    if (filter.search.match(/^[0-9]+((\.|,)[0-9]+)?$/)) {
                        _qb.orWhere(`(${this._cn('hoursNumber')} = :search)`, { search: filter.search });
                    }
                }));
            }

            if (filter.year) qb.andWhere(`${this._cn('year')} ILIKE :year`, { year: `%${filter.year}%` });

            if (filter.years?.length) qb.andWhere(`${this._cn('year')} IN (:...years)`, { years: filter.years });

            if (filter.hoursNumber) qb.andWhere(`${this._cn('hoursNumber')} = :hoursNumber`, { hoursNumber: filter.hoursNumber });

            if (filter.hoursNumbers?.length) qb.andWhere(`${this._cn('hoursNumber')} IN (:...hoursNumbers)`, { hoursNumbers: filter.hoursNumbers });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<TheoreticalHoursOfUseEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return TheoreticalHoursOfUseService.ColumnQueryNames.get(columnName);
    }

}
