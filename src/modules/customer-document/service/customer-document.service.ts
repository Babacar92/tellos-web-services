import { Inject, Injectable } from '@nestjs/common';
import { CustomerDocumentEntity } from 'src/entities/psql/CustomerDocumentEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CustomerDocumentCreateArgInput } from '../dto/args/customer-document.create.arg.input';
import { CustomerDocumentFilterArgInput } from '../dto/args/customer-document.filter.arg.input';
import { CustomerDocumentRemoveArgInput } from '../dto/args/customer-document.remove.arg.input';
import { CustomerDocumentUpdateArgInput } from '../dto/args/customer-document.update.arg.input';
import { CustomerDocumentPaginationResultInterface } from '../dto/interfaces/customer-document.pagination.result.interface';
import { CUSTOMER_DOCUMENT_PROVIDERS_NAMES } from '../dto/provider/customer-document.providers';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { dateToTimestamp, dump } from '../../../utils/utils';
import { CustomerDocumentLogger } from '../logger/customer-document.logger';

@Injectable()
export class CustomerDocumentService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'cd.id'],
        ['employee', 'e.id'],
        ['employeeId', 'e.id'],
        ['login', 'l.id'],
        ['loginId', 'l.id'],
        ['customer', 'c.id'],
        ['customerId', 'c.id'],
        ['customer.name', 'c.name'],
        ['file', 'f.id'],
        ['title', 'cd.title'],
        ['description', 'cd.description'],
        ['active', 'cd.active'],
        ['createdAt', 'cd.createdAt'],
        ['updatedAt', 'cd.updatedAt'],
        ['deletedAt', 'cd.deletedAt'],
        ['createdBy', 'cd.createdBy'],
        ['updatedBy', 'cd.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CUSTOMER_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<CustomerDocumentEntity>,
        private readonly _uploadService: UploadService,
        private readonly _logger: CustomerDocumentLogger,
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
        id?: number | CustomerDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof CustomerDocumentEntity) id = id.id;

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
        id?: number | CustomerDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof CustomerDocumentEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('cd', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (CustomerDocumentEntity.isColumnString(column)) {
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
        filter?: CustomerDocumentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerDocumentEntity[]> {
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
    public async findCustomerDocumentsAndPaginationAll(
        filter: CustomerDocumentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerDocumentPaginationResultInterface> {
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
        id: number | CustomerDocumentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerDocumentEntity> {
        if (id instanceof CustomerDocumentEntity) id = id.id;
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
    ): Promise<CustomerDocumentEntity> {
        const qb = this._initSelect(repo, manager);

        if (CustomerDocumentEntity.isColumnString(column)) {
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
        data: CustomerDocumentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerDocumentEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const customerDocument = new CustomerDocumentEntity();

            // Get uploaded file
            const { file, ...rest } = data;

            if (file) {
                customerDocument.file = await this._uploadService.saveFromGraphqlUpload(file, null, null, null, null, transaction);
            }

            // Set Data
            Object.assign(customerDocument, rest);

            // Save hit
            const result = await transaction.save(customerDocument);

            if (result) {
                this._logger.create(customerDocument);

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
        data: CustomerDocumentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerDocumentEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, file, ...req } = data;

            // Find existing
            const oldCustomerDocument = await this.findOne(id, repo, transaction);

            if (oldCustomerDocument) {
                // Set old data
                this._logger.setOldData(oldCustomerDocument);

                // Add new Data
                Object.assign(oldCustomerDocument, req);

                if (file) {
                    oldCustomerDocument.file = await this._uploadService.saveFromGraphqlUpload(file, null, null, oldCustomerDocument.file, null, transaction);
                }

                // Save Data
                const result = await transaction.save(oldCustomerDocument);

                if (result) {
                    this._logger.update(oldCustomerDocument);

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
        req: CustomerDocumentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof CustomerDocumentEntity ? id.id : id;
                const customerDocument = await this.findOne(id, repo, transaction);

                if (customerDocument instanceof CustomerDocumentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        // Remove file
                        const result = await this._uploadService.remove({
                            id: customerDocument.file,
                            type: type,
                        }, null, transaction);

                        await transaction.delete(CustomerDocumentEntity, customerDocument.id);

                        this._logger.delete(customerDocument);
                    } else {
                        await transaction.softDelete(CustomerDocumentEntity, customerDocument.id);

                        this._logger.softDelete(customerDocument);
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
    ): SelectQueryBuilder<CustomerDocumentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('cd', manager?.queryRunner)
            .leftJoinAndSelect('cd.login', 'l')
            .leftJoinAndSelect('l.employee', 'e')
            .leftJoinAndSelect('e.picture', 'pic')
            .leftJoinAndSelect('cd.customer', 'c')
            .leftJoinAndSelect('cd.file', 'f');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<CustomerDocumentEntity>,
        filter?: CustomerDocumentFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhereCrypt(`${this._cn('customer.name')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('title')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('description')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                }));
            }

            if (filter.customerId) qb.andWhere(`${this._cn('customerId')} = :customerId`, { customerId: filter.customerId });

            if (filter.customerIds?.length) qb.andWhere(`${this._cn('customerId')} IN (:...customerIds)`, { customerIds: filter.customerIds });

            let dateFromTransormed: string, dateToTransormed: string;
            if (filter.dateFrom && (dateFromTransormed = dateToTimestamp(filter.dateFrom, 'date'))) {
                qb.andWhere(`to_char(${this._cn('createdAt')}, 'YYYY-MM-DD') >= :dateFrom`, { dateFrom: dateFromTransormed });
            }

            if (filter.dateTo && (dateToTransormed = dateToTimestamp(filter.dateTo, 'date'))) {
                qb.andWhere(`to_char(${this._cn('createdAt')}, 'YYYY-MM-DD') <= :dateTo`, { dateTo: dateToTransormed });
            }

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<CustomerDocumentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return CustomerDocumentService.ColumnQueryNames.get(columnName);
    }

}
