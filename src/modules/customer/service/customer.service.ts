import { Inject, Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/psql/CustomerEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import {
    Brackets,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { CustomerCreateArgInput } from '../dto/args/customer.create.arg.input';
import { CustomerFilterArgInput } from '../dto/args/customer.filter.arg.input';
import { CustomerRemoveArgInput } from '../dto/args/customer.remove.arg.input';
import { CustomerUpdateArgInput } from '../dto/args/customer.update.arg.input';
import { CustomerPaginationResultInterface } from '../dto/interfaces/customer.pagination.result.interface';
import { CUSTOMER_PROVIDERS_NAMES } from '../dto/provider/customer.providers';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { CustomerLogger } from '../logger/customer.logger';

@Injectable()
export class CustomerService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'c.id'],
        ['name', 'c.name'],
        ['email', 'c.email'],
        ['code', 'c.code'],
        ['address', 'c.address'],
        ['addressBis', 'c.addressBis'],
        ['zipCode', 'c.zipCode'],
        ['city', 'c.city'],
        ['country', 'c.country'],
        ['familly', 'c.familly'],
        ['typology', 'c.typology'],
        ['language', 'c.language'],
        ['phone', 'c.phone'],
        ['fax', 'c.fax'],
        ['siret', 'c.siret'],
        ['ape', 'c.ape'],
        ['tvaNumber', 'c.tvaNumber'],
        ['taxeCode', 'c.taxeCode'],
        ['regulationCode', 'rc.id'],
        ['regulationCodeId', 'rc.id'],
        ['currency', 'c.currency'],
        ['rib', 'c.rib'],
        ['domiciliation', 'c.domiciliation'],
        ['iban', 'c.iban'],
        ['bic', 'c.bic'],
        ['invoiceCopyNumber', 'c.invoiceCopyNumber'],
        ['discountRate', 'c.discountRate'],
        ['invoiceEmail', 'c.invoiceEmail'],
        ['active', 'c.active'],
        ['createdAt', 'c.createdAt'],
        ['updatedAt', 'c.updatedAt'],
        ['deletedAt', 'c.deletedAt'],
        ['createdBy', 'c.createdBy'],
        ['updatedBy', 'c.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(CUSTOMER_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<CustomerEntity>,
        private readonly _uploadService: UploadService,
        private readonly _logger: CustomerLogger,
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
        id?: number | CustomerEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof CustomerEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    public async findCustomersByIds(ids: number[]): Promise<CustomerEntity[]> {
        const data = await this._defaultUserRepository.find({
            where: { id: In(ids) },
        });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
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
        id?: number | CustomerEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof CustomerEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'c',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (CustomerEntity.isCryptColumn(column)) {
                qb.andWhereCrypt(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else if (CustomerEntity.isColumnString(column)) {
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
        filter?: CustomerFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerEntity[]> {
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
    public async findCustomersAndPaginationAll(
        filter: CustomerFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerPaginationResultInterface> {
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
        id: number | CustomerEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerEntity> {
        if (id instanceof CustomerEntity) id = id.id;
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
    ): Promise<CustomerEntity> {
        const qb = this._initSelect(repo, manager);

        if (CustomerEntity.isColumnString(column)) {
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
        data: CustomerCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const customer = new CustomerEntity();

            // Get uploaded file
            const { picture, ...rest } = data;

            // Set Data
            Object.assign(customer, rest);

            if (picture) {
                customer.picture =
                    await this._uploadService.saveFromGraphqlUpload(
                        picture,
                        null,
                        null,
                        null,
                        null,
                        transaction,
                    );
            }

            // Save hit
            const result = await transaction.save(customer);

            if (result) {
                this._logger.create(customer);

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
        data: CustomerUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CustomerEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, picture, ...req } = data;

            // Find existing
            const oldCustomer = await this.findOne(id, repo, transaction);

            if (oldCustomer) {
                // Set old data
                this._logger.setOldData(oldCustomer);

                // Add new Data
                Object.assign(oldCustomer, req);

                if (picture) {
                    oldCustomer.picture =
                        await this._uploadService.saveFromGraphqlUpload(
                            picture,
                            null,
                            null,
                            oldCustomer.picture,
                            null,
                            transaction,
                        );
                }

                // Save Data
                const result = await transaction.save(oldCustomer);

                if (result) {
                    this._logger.update(oldCustomer);

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
        req: CustomerRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof CustomerEntity ? id.id : id;
                const customer = await this.findOne(id, repo, transaction);

                if (customer instanceof CustomerEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        const result = await this._uploadService.remove(
                            {
                                id: customer.picture,
                                type: type,
                            },
                            null,
                            transaction,
                        );

                        await transaction.delete(CustomerEntity, customer.id);

                        this._logger.delete(customer);
                    } else {
                        await transaction.softDelete(
                            CustomerEntity,
                            customer.id,
                        );

                        this._logger.softDelete(customer);
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
    ): SelectQueryBuilder<CustomerEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('c', manager?.queryRunner)
            .leftJoinAndSelect('c.regulationCode', 'rc')
            .leftJoinAndSelect('c.picture', 'p');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<CustomerEntity>,
        filter?: CustomerFilterArgInput,
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
                            `${this._cn('name')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('email')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('code')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('address')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('addressBis')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('zipCode')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('city')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('country')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('phone')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('fax')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('siret')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('ape')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('tvaNumber')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('rib')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('domiciliation')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('iban')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('bic')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('invoiceEmail')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                        _qb.orWhere(
                            `(${this._cn('familly')})::text ILIKE :search`,
                            { search: `%${filter.search}%` },
                        );
                        _qb.orWhere(
                            `(${this._cn('typology')})::text ILIKE :search`,
                            { search: `%${filter.search}%` },
                        );
                        _qb.orWhere(
                            `(${this._cn('language')})::text ILIKE :search`,
                            { search: `%${filter.search}%` },
                        );
                        _qb.orWhere(
                            `(${this._cn('taxeCode')})::text ILIKE :search`,
                            { search: `%${filter.search}%` },
                        );
                        _qb.orWhere(
                            `(${this._cn(
                                'regulationCode',
                            )})::text ILIKE :search`,
                            { search: `%${filter.search}%` },
                        );
                        _qb.orWhere(
                            `(${this._cn('currency')})::text ILIKE :search`,
                            { search: `%${filter.search}%` },
                        );
                        _qb.orWhere(`${this._cn('createdBy')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('updatedBy')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });

                        // For number
                        if (filter.search.match(/^[0-9]+((\.|\,)[0-9]+)?$/)) {
                            _qb.orWhere(
                                `${this._cn('invoiceCopyNumber')} = :search`,
                                { search: filter.search },
                            );
                            _qb.orWhere(
                                `${this._cn('discountRate')} = :search`,
                                { search: filter.search },
                            );
                        }
                    }),
                );
            }

            if (filter.statuses?.length)
                qb.andWhere(`${this._cn('active')} IN (:...statuses)`, {
                    statuses: filter.statuses,
                });

            if (filter.families?.length)
                qb.andWhere(`${this._cn('familly')}::text IN (:...families)`, {
                    families: filter.families,
                });

            if (filter.typologies?.length)
                qb.andWhere(
                    `${this._cn('typology')}::text IN (:...typologies)`,
                    { typologies: filter.typologies },
                );

            if (filter.code)
                qb.andWhere(`${this._cn('code')} ILIKE :code`, {
                    code: `%${filter.code}%`,
                });

            if (filter.name)
                qb.andWhere(`${this._cn('name')} ILIKE :name`, {
                    name: `%${filter.name}%`,
                });

            if (filter.address)
                qb.andWhere(`${this._cn('address')} ILIKE :address`, {
                    address: `%${filter.address}%`,
                });

            if (filter.phone)
                qb.andWhere(`${this._cn('phone')} ILIKE :phone`, {
                    phone: `%${filter.phone}%`,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<CustomerEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return CustomerService.ColumnQueryNames.get(columnName);
    }
}
