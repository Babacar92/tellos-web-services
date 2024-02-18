import { Inject, Injectable } from '@nestjs/common';
import { BusinessBatchStatusEntity } from 'src/entities/psql/BusinessBatchStatusEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessBatchStatusCreateArgInput } from '../dto/args/business-batch-status.create.arg.input';
import { BusinessBatchStatusFilterArgInput } from '../dto/args/business-batch-status.filter.arg.input';
import { BusinessBatchStatusRemoveArgInput } from '../dto/args/business-batch-status.remove.arg.input';
import { BusinessBatchStatusUpdateArgInput } from '../dto/args/business-batch-status.update.arg.input';
import { BusinessBatchStatusPaginationResultInterface } from '../dto/interfaces/business-batch-status.pagination.result.interface';
import { BUSINESS_BATCH_STATUS_PROVIDERS_NAMES } from '../dto/provider/business-batch-status.providers';
import { BusinessBatchStatusLogger } from '../logger/business-batch-status.logger';

@Injectable()
export class BusinessBatchStatusService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'bmt.id'],
        ['title', 'bmt.title'],
        ['active', 'bmt.active'],
        ['createdAt', 'bmt.createdAt'],
        ['updatedAt', 'bmt.updatedAt'],
        ['deletedAt', 'bmt.deletedAt'],
        ['createdBy', 'bmt.createdBy'],
        ['updatedBy', 'bmt.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(BUSINESS_BATCH_STATUS_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<BusinessBatchStatusEntity>,
        private readonly _logger: BusinessBatchStatusLogger,
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
        id?: number | BusinessBatchStatusEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof BusinessBatchStatusEntity) id = id.id;

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
        id?: number | BusinessBatchStatusEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof BusinessBatchStatusEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('bmt', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (BusinessBatchStatusEntity.isColumnString(column)) {
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
        filter?: BusinessBatchStatusFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchStatusEntity[]> {
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
    public async findBusinessBatchStatussAndPaginationAll(
        filter: BusinessBatchStatusFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchStatusPaginationResultInterface> {
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
        id: number | BusinessBatchStatusEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchStatusEntity> {
        if (id instanceof BusinessBatchStatusEntity) id = id.id;
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
    ): Promise<BusinessBatchStatusEntity> {
        const qb = this._initSelect(repo, manager);

        if (BusinessBatchStatusEntity.isColumnString(column)) {
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
        data: BusinessBatchStatusCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchStatusEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const businessBatchStatus = new BusinessBatchStatusEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(businessBatchStatus, rest);

            // Save hit
            const result = await transaction.save(businessBatchStatus);

            if (result) {
                this._logger.create(businessBatchStatus);

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
        data: BusinessBatchStatusUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchStatusEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldBusinessBatchStatus = await this.findOne(id, repo, transaction);

            if (oldBusinessBatchStatus) {
                // Set old data
                this._logger.setOldData(oldBusinessBatchStatus);

                // Add new Data
                Object.assign(oldBusinessBatchStatus, req);

                // Save Data
                const result = await transaction.save(oldBusinessBatchStatus);

                if (result) {
                    this._logger.update(oldBusinessBatchStatus);

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
        req: BusinessBatchStatusRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof BusinessBatchStatusEntity ? id.id : id;
                const businessBatchStatus = await this.findOne(id, repo, transaction);

                if (businessBatchStatus instanceof BusinessBatchStatusEntity) {
                    if (type === REMOVE_TYPES.HARD) {

                        await transaction.delete(BusinessBatchStatusEntity, businessBatchStatus.id);

                        this._logger.delete(businessBatchStatus);
                    } else {
                        await transaction.softDelete(BusinessBatchStatusEntity, businessBatchStatus.id);

                        this._logger.softDelete(businessBatchStatus);
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
    ): SelectQueryBuilder<BusinessBatchStatusEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('bmt', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<BusinessBatchStatusEntity>,
        filter?: BusinessBatchStatusFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.title) qb.andWhere(`${this._cn('title')} ILIKE :title`, { title: `%${filter.title}%` });

            if (filter.titles?.length) qb.andWhere(`${this._cn('title')} IN (:...titles)`, { titles: filter.titles });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<BusinessBatchStatusEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return BusinessBatchStatusService.ColumnQueryNames.get(columnName);
    }

}
