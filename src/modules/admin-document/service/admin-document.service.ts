import { Inject, Injectable } from '@nestjs/common';
import { AdminDocumentEntity } from 'src/entities/psql/AdminDocumentEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { AdminDocumentCreateArgInput } from '../dto/args/admin-document.create.arg.input';
import { AdminDocumentFilterArgInput } from '../dto/args/admin-document.filter.arg.input';
import { AdminDocumentRemoveArgInput } from '../dto/args/admin-document.remove.arg.input';
import { AdminDocumentUpdateArgInput } from '../dto/args/admin-document.update.arg.input';
import { AdminDocumentPaginationResultInterface } from '../dto/interfaces/admin-document.pagination.result.interface';
import { ADMIN_DOCUMENT_PROVIDERS_NAMES } from '../dto/provider/admin-document.providers';
import { UploadService } from '../../../libs/upload/service/upload.service';
import { AdminDocumentLogger } from '../logger/admin-document.logger';

@Injectable()
export class AdminDocumentService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'ad.id'],
        ['file', 'f.id'],
        ['fileId', 'f.id'],
        ['category', 'c.id'],
        ['categoryId', 'c.id'],
        ['title', 'ad.title'],
        ['active', 'ad.active'],
        ['createdAt', 'ad.createdAt'],
        ['updatedAt', 'ad.updatedAt'],
        ['deletedAt', 'ad.deletedAt'],
        ['createdBy', 'ad.createdBy'],
        ['updatedBy', 'ad.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(ADMIN_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<AdminDocumentEntity>,
        private readonly _uploadService: UploadService,
        private readonly _logger: AdminDocumentLogger,
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
        id?: number | AdminDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof AdminDocumentEntity) id = id.id;

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
        id?: number | AdminDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof AdminDocumentEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('ad', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (AdminDocumentEntity.isColumnString(column)) {
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
        filter?: AdminDocumentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdminDocumentEntity[]> {
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
    public async findAdminDocumentsAndPaginationAll(
        filter: AdminDocumentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdminDocumentPaginationResultInterface> {
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
        id: number | AdminDocumentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdminDocumentEntity> {
        if (id instanceof AdminDocumentEntity) id = id.id;
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
    ): Promise<AdminDocumentEntity> {
        const qb = this._initSelect(repo, manager);

        if (AdminDocumentEntity.isColumnString(column)) {
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
        data: AdminDocumentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdminDocumentEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const adminDocument = new AdminDocumentEntity();

            // Get uploaded file
            const { file, ...rest } = data;

            if (file) {
                adminDocument.file = await this._uploadService.saveFromGraphqlUpload(
                    file,
                    null,
                    null,
                    null,
                    null,
                    transaction
                );
            }

            // Set Data
            Object.assign(adminDocument, rest);

            // Save hit
            const result = await transaction.save(adminDocument);

            if (result) {
                this._logger.create(adminDocument);

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
        data: AdminDocumentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdminDocumentEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, file, ...req } = data;

            // Find existing
            const oldAdminDocument = await this.findOne(id, repo, transaction);

            if (oldAdminDocument) {
                // Set old data
                this._logger.setOldData(oldAdminDocument);

                if (file) {
                    oldAdminDocument.file = await this._uploadService.saveFromGraphqlUpload(
                        file,
                        null,
                        null,
                        oldAdminDocument.file,
                        null,
                        transaction
                    );
                }

                // Add new Data
                Object.assign(oldAdminDocument, req);

                // Save Data
                const result = await transaction.save(oldAdminDocument);

                if (result) {
                    this._logger.update(oldAdminDocument);

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
        req: AdminDocumentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof AdminDocumentEntity ? id.id : id;
                const adminDocument = await this.findOne(id, repo, transaction);

                if (adminDocument instanceof AdminDocumentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(AdminDocumentEntity, adminDocument.id);

                        this._logger.delete(adminDocument);
                    } else {
                        await transaction.softDelete(AdminDocumentEntity, adminDocument.id);

                        this._logger.softDelete(adminDocument);
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
    ): SelectQueryBuilder<AdminDocumentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('ad', manager?.queryRunner)
            .leftJoinAndSelect('ad.file', 'f')
            .leftJoinAndSelect('ad.category', 'c');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<AdminDocumentEntity>,
        filter?: AdminDocumentFilterArgInput,
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

            if (filter.categories?.length) qb.andWhere(`${this._cn('categoryId')} IN (:...categories)`, { categories: filter.categories });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<AdminDocumentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return AdminDocumentService.ColumnQueryNames.get(columnName);
    }

}
