import { Inject, Injectable } from '@nestjs/common';
import { CustomerContactEntity } from 'src/entities/psql/CustomerContactEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CustomerContactCreateArgInput } from '../dto/args/customer-contact.create.arg.input';
import { CustomerContactFilterArgInput } from '../dto/args/customer-contact.filter.arg.input';
import { CustomerContactRemoveArgInput } from '../dto/args/customer-contact.remove.arg.input';
import { CustomerContactUpdateArgInput } from '../dto/args/customer-contact.update.arg.input';
import { CustomerContactPaginationResultInterface } from '../dto/interfaces/customer-contact.pagination.result.interface';
import { CUSTOMER_CONTACT_PROVIDERS_NAMES } from '../dto/provider/customer-contact.providers';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { CustomerContactLogger } from '../logger/customer-contact.logger';

@Injectable()
export class CustomerContactService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'cc.id'],
        ['customer', 'c.id'],
        ['customerId', 'c.id'],
        ['picture', 'p.id'],
        ['customer.name', 'c.name'],
        ['lastname', 'cc.lastname'],
        ['firstname', 'cc.firstname'],
        ['company', 'cc.company'],
        ['department', 'cc.department'],
        ['position', 'cc.position'],
        ['email', 'cc.email'],
        ['phone', 'cc.phone'],
        ['phoneFix', 'cc.phoneFix'],
        ['active', 'cc.active'],
        ['createdAt', 'cc.createdAt'],
        ['updatedAt', 'cc.updatedAt'],
        ['deletedAt', 'cc.deletedAt'],
        ['createdBy', 'cc.createdBy'],
        ['updatedBy', 'cc.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CUSTOMER_CONTACT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<CustomerContactEntity>,
        private readonly _uploadService: UploadService,
        private readonly _logger: CustomerContactLogger,
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
        id?: number | CustomerContactEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof CustomerContactEntity) id = id.id;

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
        id?: number | CustomerContactEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof CustomerContactEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('cc', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (CustomerContactEntity.isCryptColumn(column)) {
                qb.andWhereCrypt(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
            } else if (CustomerContactEntity.isColumnString(column)) {
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
        filter?: CustomerContactFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerContactEntity[]> {
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
    public async findCustomerContactsAndPaginationAll(
        filter: CustomerContactFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerContactPaginationResultInterface> {
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
        id: number | CustomerContactEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerContactEntity> {
        if (id instanceof CustomerContactEntity) id = id.id;
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
    ): Promise<CustomerContactEntity> {
        const qb = this._initSelect(repo, manager);

        if (CustomerContactEntity.isColumnString(column)) {
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
        data: CustomerContactCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerContactEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const customerContact = new CustomerContactEntity();

            // Get uploaded file
            const { picture, ...rest } = data;

            // Set Data
            Object.assign(customerContact, rest);

            if (picture) {
                customerContact.picture = await this._uploadService.saveFromGraphqlUpload(picture, null, null, null, null, transaction);
            }

            // Save hit
            const result = await transaction.save(customerContact);

            if (result) {
                this._logger.create(customerContact);

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
        data: CustomerContactUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerContactEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, picture, ...req } = data;

            // Find existing
            const oldCustomerContact = await this.findOne(id, repo, transaction);

            if (oldCustomerContact) {
                // Set old data
                this._logger.setOldData(oldCustomerContact);

                // Add new Data
                Object.assign(oldCustomerContact, req);

                if (picture) {
                    oldCustomerContact.picture = await this._uploadService.saveFromGraphqlUpload(picture, null, null, oldCustomerContact.picture, null, transaction);
                }

                // Save Data
                const result = await transaction.save(oldCustomerContact);

                if (result) {
                    this._logger.update(oldCustomerContact);

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
        req: CustomerContactRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof CustomerContactEntity ? id.id : id;
                const customerContact = await this.findOne(id, repo, transaction);

                if (customerContact instanceof CustomerContactEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(CustomerContactEntity, customerContact.id);

                        this._logger.delete(customerContact);
                    } else {
                        await transaction.softDelete(CustomerContactEntity, customerContact.id);

                        this._logger.softDelete(customerContact);
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
    ): SelectQueryBuilder<CustomerContactEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('cc', manager?.queryRunner)
            .leftJoinAndSelect('cc.customer', 'c')
            .leftJoinAndSelect('cc.picture', 'p');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<CustomerContactEntity>,
        filter?: CustomerContactFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhereCrypt(`${this._cn('customer.name')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('lastname')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('firstname')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('company')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('department')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('position')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('email')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('phone')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                    _qb.orWhereCrypt(`${this._cn('phoneFix')} ILIKE :search`, { search: `%${filter.search}%` }, 'LIKE');
                }));
            }

            if (filter.customerId) qb.andWhere(`${this._cn('customerId')} = :customerId`, { customerId: filter.customerId });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<CustomerContactEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return CustomerContactService.ColumnQueryNames.get(columnName);
    }

}
