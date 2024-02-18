import { Inject, Injectable } from '@nestjs/common';
import { DocumentTypeEntity } from 'src/entities/psql/DocumentTypeEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import {
    Brackets,
    DataSource,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { DocumentTypeCreateArgInput } from '../dto/args/document-type.create.arg.input';
import { DocumentTypeFilterArgInput } from '../dto/args/document-type.filter.arg.input';
import { DocumentTypeRemoveArgInput } from '../dto/args/document-type.remove.arg.input';
import { DocumentTypeUpdateArgInput } from '../dto/args/document-type.update.arg.input';
import { DocumentTypePaginationResultInterface } from '../dto/interfaces/document-type.pagination.result.interface';
import { DOCUMENT_TYPE_PROVIDERS_NAMES } from '../dto/provider/document-type.providers';
import { DocumentTypeLogger } from '../logger/document-type.logger';
import { PSQL_DB_CONN_NAME } from '@/datasource-config';

@Injectable()
export class DocumentTypeService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'dt.id'],
        ['title', 'dt.title'],
        ['active', 'dt.active'],
        ['category', 'dc.id'],
        ['category.title', 'dc.title'],
        ['categoryTitle', 'dc.title'],
        ['createdAt', 'dt.createdAt'],
        ['updatedAt', 'dt.updatedAt'],
        ['deletedAt', 'dt.deletedAt'],
        ['createdBy', 'dt.createdBy'],
        ['updatedBy', 'dt.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(DOCUMENT_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<DocumentTypeEntity>,
        private readonly _logger: DocumentTypeLogger,
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
    ) {
        super();
    }

    public async findDocumentTypesByIds(
        ids: number[],
    ): Promise<DocumentTypeEntity[]> {
        const data = await this.dataSource
            .getRepository(DocumentTypeEntity)
            .find({ where: { id: In(ids) } });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
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
        id?: number | DocumentTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof DocumentTypeEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
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
        id?: number | DocumentTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof DocumentTypeEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'dt',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (DocumentTypeEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, {
                    column_value: value,
                });
            }

            if (id > 0 && column !== 'id')
                qb.andWhere(`${this._cn('id')} != :column_id`, {
                    column_id: id,
                });

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
        filter?: DocumentTypeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentTypeEntity[]> {
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
    public async findDocumentTypesAndPaginationAll(
        filter: DocumentTypeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentTypePaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

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
        id: number | DocumentTypeEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentTypeEntity> {
        if (id instanceof DocumentTypeEntity) id = id.id;
        return this.findByColumn('id', id, repo, manager);
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
    ): Promise<DocumentTypeEntity> {
        const qb = this._initSelect(repo, manager);

        if (DocumentTypeEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                column_value: value,
            });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, {
                column_value: value,
            });
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
        data: DocumentTypeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentTypeEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const documentType = new DocumentTypeEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(documentType, rest);

            // Save hit
            const result = await transaction.save(documentType);

            if (result) {
                this._logger.create(documentType);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update new Quick Access
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: DocumentTypeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DocumentTypeEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldDocumentType = await this.findOne(id, repo, transaction);

            if (oldDocumentType) {
                // Set old data
                this._logger.update(oldDocumentType);

                // Add new Data
                Object.assign(oldDocumentType, req);

                // Save Data
                const result = await transaction.save(oldDocumentType);

                if (result) {
                    this._logger.update(oldDocumentType);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, manager || repo);
    }

    /**
     * Update an existing entity
     * @param updateEntity
     * @param repo
     * @returns
     */
    public async remove(
        req: DocumentTypeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof DocumentTypeEntity ? id.id : id;
                const documentType = await this.findOne(id, repo, transaction);

                if (documentType instanceof DocumentTypeEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            DocumentTypeEntity,
                            documentType.id,
                        );

                        this._logger.delete(documentType);
                    } else {
                        await transaction.softDelete(
                            DocumentTypeEntity,
                            documentType.id,
                        );

                        this._logger.softDelete(documentType);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, manager || repo);
    }

    /**
     * Init Select Query Builder
     * @param repo
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<DocumentTypeEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('dt', manager?.queryRunner)
            .leftJoinAndSelect('dt.category', 'dc')
            .leftJoinAndSelect('dt.documents', 'ds');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<DocumentTypeEntity>,
        filter?: DocumentTypeFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });

                        _qb.orWhere(
                            `(${this._cn('categoryTitle')} ILIKE :search)`,
                            { search: `%${filter.search}%` },
                        );
                    }),
                );
            }

            if (filter.title)
                qb.andWhere(`${this._cn('title')} ILIKE :title`, {
                    title: `%${filter.title}%`,
                });

            if (filter.titles?.length)
                qb.andWhere(`${this._cn('title')} IN (:...titles)`, {
                    titles: filter.titles,
                });

            if (filter.category)
                qb.andWhere(`${this._cn('category')} = :category`, {
                    category: `%${filter.category}%`,
                });

            if (filter.categories?.length)
                qb.andWhere(`${this._cn('category')} IN (:...categories)`, {
                    categories: filter.categories,
                });

            if (filter.categoryTitle)
                qb.andWhere(
                    `${this._cn('categoryTitle')} ILIKE :categoryTitle`,
                    { categoryTitle: `%${filter.categoryTitle}%` },
                );

            if (filter.categoryTitles?.length)
                qb.andWhere(
                    `${this._cn('categoryTitle')} IN (:...categoryTitles)`,
                    { categoryTitles: filter.categoryTitles },
                );
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<DocumentTypeEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return DocumentTypeService.ColumnQueryNames.get(columnName);
    }
}
