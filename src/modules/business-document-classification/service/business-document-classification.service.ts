import { Inject, Injectable } from '@nestjs/common';
import { BusinessDocumentClassificationEntity } from 'src/entities/psql/BusinessDocumentClassificationEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessDocumentClassificationCreateArgInput } from '../dto/args/business-document-classification.create.arg.input';
import { BusinessDocumentClassificationFilterArgInput } from '../dto/args/business-document-classification.filter.arg.input';
import { BusinessDocumentClassificationRemoveArgInput } from '../dto/args/business-document-classification.remove.arg.input';
import { BusinessDocumentClassificationUpdateArgInput } from '../dto/args/business-document-classification.update.arg.input';
import { BusinessDocumentClassificationPaginationResultInterface } from '../dto/interfaces/business-document-classification.pagination.result.interface';
import { BUSINESS_DOCUMENT_CLASSIFICATION_PROVIDERS_NAMES } from '../dto/provider/business-document-classification.providers';
import { BusinessDocumentClassificationLogger } from '../logger/business-document-classification.logger';

@Injectable()
export class BusinessDocumentClassificationService extends AbstractRepositoryService {

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
        @Inject(BUSINESS_DOCUMENT_CLASSIFICATION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<BusinessDocumentClassificationEntity>,
        private readonly _logger: BusinessDocumentClassificationLogger,
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
        id?: number | BusinessDocumentClassificationEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof BusinessDocumentClassificationEntity) id = id.id;

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
        id?: number | BusinessDocumentClassificationEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof BusinessDocumentClassificationEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('bmt', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (BusinessDocumentClassificationEntity.isColumnString(column)) {
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
        filter?: BusinessDocumentClassificationFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentClassificationEntity[]> {
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
    public async findBusinessDocumentClassificationsAndPaginationAll(
        filter: BusinessDocumentClassificationFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentClassificationPaginationResultInterface> {
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
        id: number | BusinessDocumentClassificationEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentClassificationEntity> {
        if (id instanceof BusinessDocumentClassificationEntity) id = id.id;
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
    ): Promise<BusinessDocumentClassificationEntity> {
        const qb = this._initSelect(repo, manager);

        if (BusinessDocumentClassificationEntity.isColumnString(column)) {
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
        data: BusinessDocumentClassificationCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentClassificationEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const businessDocumentClassification = new BusinessDocumentClassificationEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(businessDocumentClassification, rest);

            // Save hit
            const result = await transaction.save(businessDocumentClassification);

            if (result) {
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
        data: BusinessDocumentClassificationUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentClassificationEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldBusinessDocumentClassification = await this.findOne(id, repo, transaction);

            if (oldBusinessDocumentClassification) {

                // Add new Data
                Object.assign(oldBusinessDocumentClassification, req);

                // Save Data
                const result = await transaction.save(oldBusinessDocumentClassification);

                if (result) {
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
        req: BusinessDocumentClassificationRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof BusinessDocumentClassificationEntity ? id.id : id;
                const businessDocumentClassification = await this.findOne(id, repo, transaction);

                if (businessDocumentClassification instanceof BusinessDocumentClassificationEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(BusinessDocumentClassificationEntity, businessDocumentClassification.id);

                        this._logger.delete(businessDocumentClassification);
                    } else {
                        await transaction.softDelete(BusinessDocumentClassificationEntity, businessDocumentClassification.id);

                        this._logger.softDelete(businessDocumentClassification);
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
    ): SelectQueryBuilder<BusinessDocumentClassificationEntity> {
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
        qb: SelectQueryBuilder<BusinessDocumentClassificationEntity>,
        filter?: BusinessDocumentClassificationFilterArgInput,
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

    public getRepo(repo?: string): Repository<BusinessDocumentClassificationEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return BusinessDocumentClassificationService.ColumnQueryNames.get(columnName);
    }

}
