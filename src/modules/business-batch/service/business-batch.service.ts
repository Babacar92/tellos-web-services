import { Inject, Injectable } from '@nestjs/common';
import { BusinessBatchEntity } from 'src/entities/psql/BusinessBatchEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessBatchCreateArgInput } from '../dto/args/business-batch.create.arg.input';
import { BusinessBatchFilterArgInput } from '../dto/args/business-batch.filter.arg.input';
import { BusinessBatchRemoveArgInput } from '../dto/args/business-batch.remove.arg.input';
import { BusinessBatchUpdateArgInput } from '../dto/args/business-batch.update.arg.input';
import { BusinessBatchPaginationResultInterface } from '../dto/interfaces/business-batch.pagination.result.interface';
import { BUSINESS_BATCH_PROVIDERS_NAMES } from '../dto/provider/business-batch.providers';
import { BusinessBatchLogger } from '../logger/business-batch.logger';

@Injectable()
export class BusinessBatchService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'bb.id'],
        ['business', 'bus.id'],
        ['businessId', 'bus.id'],
        ['status', 'st.id'],
        ['statusId', 'st.id'],
        ['commercial', 'c.id'],
        ['commercialId', 'c.id'],
        ['label', 'bb.label'],
        ['apology', 'bb.apology'],
        ['active', 'bb.active'],
        ['createdAt', 'bb.createdAt'],
        ['updatedAt', 'bb.updatedAt'],
        ['deletedAt', 'bb.deletedAt'],
        ['createdBy', 'bb.createdBy'],
        ['updatedBy', 'bb.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(BUSINESS_BATCH_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<BusinessBatchEntity>,
        private readonly _logger: BusinessBatchLogger,
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
        id?: number | BusinessBatchEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof BusinessBatchEntity) id = id.id;

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
        id?: number | BusinessBatchEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof BusinessBatchEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('bb', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (BusinessBatchEntity.isColumnString(column)) {
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
        filter?: BusinessBatchFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchEntity[]> {
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
    public async findBusinessBatchsAndPaginationAll(
        filter: BusinessBatchFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchPaginationResultInterface> {
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
        id: number | BusinessBatchEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchEntity> {
        if (id instanceof BusinessBatchEntity) id = id.id;
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
    ): Promise<BusinessBatchEntity> {
        const qb = this._initSelect(repo, manager);

        if (BusinessBatchEntity.isColumnString(column)) {
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
        data: BusinessBatchCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const businessBatch = new BusinessBatchEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(businessBatch, rest);

            // Save hit
            const result = await transaction.save(businessBatch);

            if (result) {
                this._logger.create(businessBatch);

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
        data: BusinessBatchUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBatchEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldBusinessBatch = await this.findOne(id, repo, transaction);

            if (oldBusinessBatch) {
                // Set old data
                this._logger.setOldData(oldBusinessBatch);

                // Add new Data
                Object.assign(oldBusinessBatch, req);

                // Save Data
                const result = await transaction.save(oldBusinessBatch);

                if (result) {
                    this._logger.update(oldBusinessBatch);

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
        req: BusinessBatchRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof BusinessBatchEntity ? id.id : id;
                const businessBatch = await this.findOne(id, repo, transaction);

                if (businessBatch instanceof BusinessBatchEntity) {
                    if (type === REMOVE_TYPES.HARD) {

                        await transaction.delete(BusinessBatchEntity, businessBatch.id);

                        this._logger.delete(businessBatch);
                    } else {
                        await transaction.softDelete(BusinessBatchEntity, businessBatch.id);

                        this._logger.softDelete(businessBatch);
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
    ): SelectQueryBuilder<BusinessBatchEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('bb', manager?.queryRunner)
            .leftJoinAndSelect('bb.business', 'bus')
            .leftJoinAndSelect('bb.status', 'st')
            .leftJoinAndSelect('bb.commercial', 'c')
            ;

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<BusinessBatchEntity>,
        filter?: BusinessBatchFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('label')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('apology')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.apology) qb.andWhere(`${this._cn('apology')} ILIKE :apology`, { apology: `%${filter.apology}%` });

            if (filter.label) qb.andWhere(`${this._cn('label')} ILIKE :label`, { label: `%${filter.label}%` });

            if (filter.labels?.length) qb.andWhere(`${this._cn('label')} IN (:...labels)`, { labels: filter.labels });

            if (filter.businessId) qb.andWhere(`${this._cn('businessId')} = :businessId`, { businessId: filter.businessId });

            if (filter.businessIds?.length) qb.andWhere(`${this._cn('businessId')} IN (:...businessIds)`, { businessIds: filter.businessIds });

            if (filter.statusesIds?.length) qb.andWhere(`${this._cn('statusId')} IN (:...statusesIds)`, { statusesIds: filter.statusesIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<BusinessBatchEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return BusinessBatchService.ColumnQueryNames.get(columnName);
    }

}
