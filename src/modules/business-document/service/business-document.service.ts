import { Inject, Injectable } from '@nestjs/common';
import { BusinessDocumentEntity } from 'src/entities/psql/BusinessDocumentEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import {
    Brackets,
    EntityManager,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { BusinessDocumentCreateArgInput } from '../dto/args/business-document.create.arg.input';
import { BusinessDocumentFilterArgInput } from '../dto/args/business-document.filter.arg.input';
import { BusinessDocumentRemoveArgInput } from '../dto/args/business-document.remove.arg.input';
import { BusinessDocumentUpdateArgInput } from '../dto/args/business-document.update.arg.input';
import { BusinessDocumentPaginationResultInterface } from '../dto/interfaces/business-document.pagination.result.interface';
import { BUSINESS_DOCUMENT_PROVIDERS_NAMES } from '../dto/provider/business-document.providers';
import { UploadService } from '../../../libs/upload/service/upload.service';
import { BusinessDocumentLogger } from '../logger/business-document.logger';

@Injectable()
export class BusinessDocumentService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'bd.id'],
        ['label', 'bd.label'],
        ['business', 'b.id'],
        ['businessId', 'b.id'],
        ['type', 't.id'],
        ['typeId', 't.id'],
        ['classification', 'c.id'],
        ['classificationId', 'c.id'],
        ['login', 'l.id'],
        ['loginId', 'l.id'],
        ['employee', 'e.id'],
        ['employeeId', 'e.id'],
        ['active', 'bd.active'],
        ['createdAt', 'bd.createdAt'],
        ['updatedAt', 'bd.updatedAt'],
        ['deletedAt', 'bd.deletedAt'],
        ['createdBy', 'bd.createdBy'],
        ['updatedBy', 'bd.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(BUSINESS_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<BusinessDocumentEntity>,
        private readonly _logger: BusinessDocumentLogger,
        private readonly _uploadService: UploadService,
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
        id?: number | BusinessDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof BusinessDocumentEntity) id = id.id;

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
        id?: number | BusinessDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof BusinessDocumentEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'bd',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (BusinessDocumentEntity.isColumnString(column)) {
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
        filter?: BusinessDocumentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentEntity[]> {
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
    public async findBusinessDocumentsAndPaginationAll(
        filter: BusinessDocumentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentPaginationResultInterface> {
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
        id: number | BusinessDocumentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentEntity> {
        if (id instanceof BusinessDocumentEntity) id = id.id;
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
    ): Promise<BusinessDocumentEntity> {
        const qb = this._initSelect(repo, manager);

        if (BusinessDocumentEntity.isColumnString(column)) {
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
        data: BusinessDocumentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const businessDocument = new BusinessDocumentEntity();

            // Get uploaded file
            const { file, ...rest } = data;

            // Set Data
            Object.assign(businessDocument, rest);

            if (file) {
                businessDocument.file =
                    await this._uploadService.saveFromGraphqlUpload(
                        file,
                        null,
                        null,
                        null,
                        null,
                        transaction,
                    );
            }

            // Save hit
            const result = await transaction.save(businessDocument);

            if (result) {
                this._logger.create(businessDocument);

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
        data: BusinessDocumentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessDocumentEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, file, ...req } = data;

            // Find existing
            const oldBusinessDocument = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldBusinessDocument) {
                // Set old data
                this._logger.setOldData(oldBusinessDocument);

                // Add new Data
                Object.assign(oldBusinessDocument, req);

                if (file) {
                    oldBusinessDocument.file =
                        await this._uploadService.saveFromGraphqlUpload(
                            file,
                            null,
                            null,
                            oldBusinessDocument.file,
                            null,
                            transaction,
                        );
                }

                // Save Data
                const result = await transaction.save(oldBusinessDocument);

                if (result) {
                    this._logger.update(oldBusinessDocument);

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
        req: BusinessDocumentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof BusinessDocumentEntity ? id.id : id;
                const businessDocument = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (businessDocument instanceof BusinessDocumentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            BusinessDocumentEntity,
                            businessDocument.id,
                        );

                        this._logger.delete(businessDocument);
                    } else {
                        await transaction.softDelete(
                            BusinessDocumentEntity,
                            businessDocument.id,
                        );

                        this._logger.softDelete(businessDocument);
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
    ): SelectQueryBuilder<BusinessDocumentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('bd', manager?.queryRunner)
            .leftJoinAndSelect('bd.business', 'b')
            .leftJoinAndSelect('bd.type', 't')
            .leftJoinAndSelect('bd.file', 'f')
            .leftJoinAndSelect('bd.classification', 'c')
            .leftJoinAndSelect('bd.login', 'l')
            .leftJoinAndSelect('l.employee', 'e');
        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<BusinessDocumentEntity>,
        filter?: BusinessDocumentFilterArgInput,
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
                        _qb.orWhere(`(${this._cn('label')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }

            if (filter.label)
                qb.andWhere(`${this._cn('label')} ILIKE :label`, {
                    label: `%${filter.label}%`,
                });

            if (filter.labels?.length)
                qb.andWhere(`${this._cn('label')} IN (:...labels)`, {
                    labels: filter.labels,
                });

            if (filter.businessId)
                qb.andWhere(`${this._cn('businessId')} = :businessId`, {
                    businessId: filter.businessId,
                });

            if (filter.businessIds?.length)
                qb.andWhere(`${this._cn('businessId')} IN (:...businessIds)`, {
                    businessIds: filter.businessIds,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<BusinessDocumentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return BusinessDocumentService.ColumnQueryNames.get(columnName);
    }
}
