import { Inject, Injectable } from '@nestjs/common';
import { DocumentCategoryEntity } from 'src/entities/psql/DocumentCategoryEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { DocumentCategoryCreateArgInput } from '../dto/args/document-category.create.arg.input';
import { DocumentCategoryFilterArgInput } from '../dto/args/document-category.filter.arg.input';
import { DocumentCategoryRemoveArgInput } from '../dto/args/document-category.remove.arg.input';
import { DocumentCategoryUpdateArgInput } from '../dto/args/document-category.update.arg.input';
import { DocumentCategoryPaginationResultInterface } from '../dto/interfaces/document-category.pagination.result.interface';
import { DOCUMENT_CATEGORY_PROVIDERS_NAMES } from '../dto/provider/document-category.providers';
import { DocumentCategoryLogger } from '../logger/document-category.logger';

@Injectable()
export class DocumentCategoryService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'dc.id'],
        ['title', 'dc.title'],
        ['icon', 'dc.icon'],
        ['active', 'dc.active'],
        ['createdAt', 'dc.createdAt'],
        ['updatedAt', 'dc.updatedAt'],
        ['deletedAt', 'dc.deletedAt'],
        ['createdBy', 'dc.createdBy'],
        ['updatedBy', 'dc.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(DOCUMENT_CATEGORY_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<DocumentCategoryEntity>,
        private readonly _logger: DocumentCategoryLogger,
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
        id?: number | DocumentCategoryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof DocumentCategoryEntity) id = id.id;

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
        id?: number | DocumentCategoryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof DocumentCategoryEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('dc', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (DocumentCategoryEntity.isColumnString(column)) {
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
        filter?: DocumentCategoryFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentCategoryEntity[]> {
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
    public async findDocumentCategoriesAndPaginationAll(
        filter: DocumentCategoryFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentCategoryPaginationResultInterface> {
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
        id: number | DocumentCategoryEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentCategoryEntity> {
        if (id instanceof DocumentCategoryEntity) id = id.id;
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
    ): Promise<DocumentCategoryEntity> {
        const qb = this._initSelect(repo, manager);

        if (DocumentCategoryEntity.isColumnString(column)) {
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
        data: DocumentCategoryCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentCategoryEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const documentCategory = new DocumentCategoryEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(documentCategory, rest);

            // Save hit
            const result = await transaction.save(documentCategory);

            if (result) {
                this._logger.create(documentCategory);

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
        data: DocumentCategoryUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentCategoryEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldDocumentCategory = await this.findOne(id, repo, transaction);

            if (oldDocumentCategory) {
                // Set old data
                this._logger.setOldData(oldDocumentCategory);

                // Add new Data
                Object.assign(oldDocumentCategory, req);

                // Save Data
                const result = await transaction.save(oldDocumentCategory);

                if (result) {
                    this._logger.update(oldDocumentCategory);

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
        req: DocumentCategoryRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof DocumentCategoryEntity ? id.id : id;
                const documentCategory = await this.findOne(id, repo, transaction);

                if (documentCategory instanceof DocumentCategoryEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(DocumentCategoryEntity, documentCategory.id);

                        this._logger.delete(documentCategory);
                    } else {
                        await transaction.softDelete(DocumentCategoryEntity, documentCategory.id);

                        this._logger.softDelete(documentCategory);
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
    ): SelectQueryBuilder<DocumentCategoryEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('dc', manager?.queryRunner)
            .leftJoinAndSelect('dc.types', 'dt');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<DocumentCategoryEntity>,
        filter?: DocumentCategoryFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('icon')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.title) qb.andWhere(`${this._cn('title')} ILIKE :title`, { title: `%${filter.title}%` });

            if (filter.titles?.length) qb.andWhere(`${this._cn('title')} IN (:...titles)`, { titles: filter.titles });

            if (filter.icon) qb.andWhere(`${this._cn('icon')} ILIKE :icon`, { icon: `%${filter.icon}%` });

            if (filter.icons?.length) qb.andWhere(`${this._cn('icon')} IN (:...icons)`, { icons: filter.icons });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<DocumentCategoryEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return DocumentCategoryService.ColumnQueryNames.get(columnName);
    }

}
