import { Inject, Injectable } from '@nestjs/common';
import { CustomerNoteEntity } from 'src/entities/psql/CustomerNoteEntity';
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
import { CustomerNoteCreateArgInput } from '../dto/args/customer-note.create.arg.input';
import { CustomerNoteFilterArgInput } from '../dto/args/customer-note.filter.arg.input';
import { CustomerNoteRemoveArgInput } from '../dto/args/customer-note.remove.arg.input';
import { CustomerNoteUpdateArgInput } from '../dto/args/customer-note.update.arg.input';
import { CustomerNotePaginationResultInterface } from '../dto/interfaces/customer-note.pagination.result.interface';
import { CUSTOMER_NOTE_PROVIDERS_NAMES } from '../dto/provider/customer-note.providers';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { CustomerNoteLogger } from '../logger/customer-note.logger';

@Injectable()
export class CustomerNoteService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'cn.id'],
        ['employee', 'e.id'],
        ['employeeId', 'e.id'],
        ['login', 'l.id'],
        ['loginId', 'l.id'],
        ['customer', 'c.id'],
        ['customerId', 'c.id'],
        ['customer.name', 'c.name'],
        ['comment', 'cn.comment'],
        ['active', 'cn.active'],
        ['createdAt', 'cn.createdAt'],
        ['updatedAt', 'cn.updatedAt'],
        ['deletedAt', 'cn.deletedAt'],
        ['createdBy', 'cn.createdBy'],
        ['updatedBy', 'cn.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(CUSTOMER_NOTE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<CustomerNoteEntity>,
        private readonly _uploadService: UploadService,
        private readonly _logger: CustomerNoteLogger,
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
        id?: number | CustomerNoteEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof CustomerNoteEntity) id = id.id;

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
        id?: number | CustomerNoteEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof CustomerNoteEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'cn',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (CustomerNoteEntity.isColumnString(column)) {
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
        filter?: CustomerNoteFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerNoteEntity[]> {
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
    public async findCustomerNotesAndPaginationAll(
        filter: CustomerNoteFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerNotePaginationResultInterface> {
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
        id: number | CustomerNoteEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerNoteEntity> {
        if (id instanceof CustomerNoteEntity) id = id.id;
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
    ): Promise<CustomerNoteEntity> {
        const qb = this._initSelect(repo, manager);

        if (CustomerNoteEntity.isColumnString(column)) {
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
        data: CustomerNoteCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerNoteEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const customerNote = new CustomerNoteEntity();

            // Get uploaded file
            const { documents, ...rest } = data;

            // Set Data
            Object.assign(customerNote, rest);

            if (documents?.length) {
                customerNote.documents =
                    await this._uploadService.saveFromGraphqlUploadMultiple(
                        documents,
                        null,
                        null,
                        null,
                        transaction,
                    );
            }

            // Save hit
            const result = await transaction.save(customerNote);

            if (result) {
                this._logger.create(customerNote);

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
        data: CustomerNoteUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerNoteEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, documents, ...req } = data;

            // Find existing
            const oldCustomerNote = await this.findOne(id, repo, transaction);

            if (oldCustomerNote) {
                // Set old data
                this._logger.setOldData(oldCustomerNote);

                // Add new Data
                Object.assign(oldCustomerNote, req);

                if (documents?.length) {
                    const oldDocuments = oldCustomerNote.documents || [];

                    if (oldDocuments.length) {
                        for (const i in oldDocuments) {
                            const document = oldDocuments[i];

                            await this._uploadService.remove(
                                {
                                    id: document,
                                    type: REMOVE_TYPES.HARD,
                                },
                                null,
                                transaction,
                            );
                        }
                    }

                    oldCustomerNote.documents =
                        await this._uploadService.saveFromGraphqlUploadMultiple(
                            documents,
                            null,
                            null,
                            null,
                            transaction,
                        );
                } else delete oldCustomerNote.documents;

                // Save Data
                const result = await transaction.save(oldCustomerNote);

                if (result) {
                    this._logger.update(oldCustomerNote);

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
        req: CustomerNoteRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof CustomerNoteEntity ? id.id : id;
                const customerNote = await this.findOne(id, repo, transaction);

                if (customerNote instanceof CustomerNoteEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        for (const k in customerNote.documents || []) {
                            const document = customerNote.documents[k];

                            await this._uploadService.remove(
                                {
                                    id: document,
                                    type: REMOVE_TYPES.HARD,
                                },
                                null,
                                transaction,
                            );
                        }

                        await transaction.delete(
                            CustomerNoteEntity,
                            customerNote.id,
                        );

                        this._logger.delete(customerNote);
                    } else {
                        await transaction.softDelete(
                            CustomerNoteEntity,
                            customerNote.id,
                        );

                        this._logger.softDelete(customerNote);
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
    ): SelectQueryBuilder<CustomerNoteEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('cn', manager?.queryRunner)
            .leftJoinAndSelect('cn.login', 'l')
            .leftJoinAndSelect('l.employee', 'e')
            .leftJoinAndSelect('e.picture', 'pic')
            .leftJoinAndSelect('cn.customer', 'c')
            .leftJoinAndSelect('cn.documents', 'd');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<CustomerNoteEntity>,
        filter?: CustomerNoteFilterArgInput,
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
                        _qb.orWhereCrypt(
                            `${this._cn('customer.name')} ILIKE :search`,
                            { search: `%${filter.search}%` },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('comment')} ILIKE :search`,
                            { search: `%${filter.search}%` },
                            'LIKE',
                        );
                    }),
                );
            }

            if (filter.customerId)
                qb.andWhere(`${this._cn('customerId')} = :customerId`, {
                    customerId: filter.customerId,
                });

            if (filter.loginId)
                qb.andWhere(`${this._cn('loginId')} = :loginId`, {
                    loginId: filter.loginId,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<CustomerNoteEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return CustomerNoteService.ColumnQueryNames.get(columnName);
    }
}
