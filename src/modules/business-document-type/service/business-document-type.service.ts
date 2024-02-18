import { Inject, Injectable } from '@nestjs/common';
import { BusinessDocumentTypeEntity } from 'src/entities/psql/BusinessDocumentTypeEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessDocumentTypeCreateArgInput } from '../dto/args/business-document-type.create.arg.input';
import { BusinessDocumentTypeFilterArgInput } from '../dto/args/business-document-type.filter.arg.input';
import { BusinessDocumentTypeRemoveArgInput } from '../dto/args/business-document-type.remove.arg.input';
import { BusinessDocumentTypeUpdateArgInput } from '../dto/args/business-document-type.update.arg.input';
import { BusinessDocumentTypePaginationResultInterface } from '../dto/interfaces/business-document-type.pagination.result.interface';
import { BUSINESS_DOCUMENT_TYPE_PROVIDERS_NAMES } from '../dto/provider/business-document-type.providers';
import { BusinessDocumentTypeLogger } from '../logger/business-document-type.logger';

@Injectable()
export class BusinessDocumentTypeService extends AbstractRepositoryService {

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
        @Inject(BUSINESS_DOCUMENT_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<BusinessDocumentTypeEntity>,
        private readonly _logger: BusinessDocumentTypeLogger,
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
        id?: number | BusinessDocumentTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof BusinessDocumentTypeEntity) id = id.id;

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
        id?: number | BusinessDocumentTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof BusinessDocumentTypeEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('bmt', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (BusinessDocumentTypeEntity.isColumnString(column)) {
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
        filter?: BusinessDocumentTypeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentTypeEntity[]> {
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
    public async findBusinessDocumentTypesAndPaginationAll(
        filter: BusinessDocumentTypeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentTypePaginationResultInterface> {
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
        id: number | BusinessDocumentTypeEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentTypeEntity> {
        if (id instanceof BusinessDocumentTypeEntity) id = id.id;
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
    ): Promise<BusinessDocumentTypeEntity> {
        const qb = this._initSelect(repo, manager);

        if (BusinessDocumentTypeEntity.isColumnString(column)) {
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
        data: BusinessDocumentTypeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentTypeEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const businessDocumentType = new BusinessDocumentTypeEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(businessDocumentType, rest);

            // Save hit
            const result = await transaction.save(businessDocumentType);

            if (result) {
                this._logger.create(businessDocumentType);

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
        data: BusinessDocumentTypeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentTypeEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldBusinessDocumentType = await this.findOne(id, repo, transaction);

            if (oldBusinessDocumentType) {
                // Set old data
                this._logger.setOldData(oldBusinessDocumentType);

                // Add new Data
                Object.assign(oldBusinessDocumentType, req);

                // Save Data
                const result = await transaction.save(oldBusinessDocumentType);

                if (result) {
                    this._logger.update(oldBusinessDocumentType);

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
        req: BusinessDocumentTypeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof BusinessDocumentTypeEntity ? id.id : id;
                const businessDocumentType = await this.findOne(id, repo, transaction);

                if (businessDocumentType instanceof BusinessDocumentTypeEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(BusinessDocumentTypeEntity, businessDocumentType.id);

                        this._logger.delete(businessDocumentType);
                    } else {
                        await transaction.softDelete(BusinessDocumentTypeEntity, businessDocumentType.id);

                        this._logger.softDelete(businessDocumentType);
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
    ): SelectQueryBuilder<BusinessDocumentTypeEntity> {
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
        qb: SelectQueryBuilder<BusinessDocumentTypeEntity>,
        filter?: BusinessDocumentTypeFilterArgInput,
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

    public getRepo(repo?: string): Repository<BusinessDocumentTypeEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return BusinessDocumentTypeService.ColumnQueryNames.get(columnName);
    }

}
