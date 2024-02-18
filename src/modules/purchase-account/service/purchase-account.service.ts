import { Inject, Injectable } from '@nestjs/common';
import { PurchaseAccountEntity } from 'src/entities/psql/PurchaseAccountEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { PurchaseAccountCreateArgInput } from '../dto/args/purchase-account.create.arg.input';
import { PurchaseAccountFilterArgInput } from '../dto/args/purchase-account.filter.arg.input';
import { PurchaseAccountRemoveArgInput } from '../dto/args/purchase-account.remove.arg.input';
import { PurchaseAccountUpdateArgInput } from '../dto/args/purchase-account.update.arg.input';
import { PurchaseAccountPaginationResultInterface } from '../dto/interfaces/purchase-account.pagination.result.interface';
import { PURCHASE_ACCOUNT_PROVIDERS_NAMES } from '../dto/provider/purchase-account.providers';
import { PurchaseAccountLogger } from '../logger/purchase-account.logger';

@Injectable()
export class PurchaseAccountService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'pa.id'],
        ['account', 'pa.account'],
        ['sectionCodeId', 'sc.id'],
        ['sectionCode', 'sc.id'],
        ['sectionCode.sectionCode', 'sc.sectionCode'],
        ['sectionCode.designation', 'sc.designation'],
        ['sectionCode.inventoryChangeAccount', 'sc.inventoryChangeAccount'],
        ['active', 'pa.active'],
        ['createdAt', 'pa.createdAt'],
        ['updatedAt', 'pa.updatedAt'],
        ['deletedAt', 'pa.deletedAt'],
        ['createdBy', 'pa.createdBy'],
        ['updatedBy', 'pa.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(PURCHASE_ACCOUNT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<PurchaseAccountEntity>,
        private readonly _logger: PurchaseAccountLogger,
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
        id?: number | PurchaseAccountEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof PurchaseAccountEntity) id = id.id;

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
        id?: number | PurchaseAccountEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof PurchaseAccountEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('pa', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (PurchaseAccountEntity.isColumnString(column)) {
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
        filter?: PurchaseAccountFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PurchaseAccountEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }

    /**
     * Save a Purchase Account
     * @param type
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async savePurchaseAccount(
        purchaseAccount?: string,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PurchaseAccountEntity[] | any> {
        return new Promise(async (resolve) => {

            if (purchaseAccount) {
                const result = await this._saveNewPurchaseAccount({
                    account: purchaseAccount,
                }, repo, manager);

                resolve(result);
            } else {
                resolve({
                    error: {
                        message: 'No Purchase Account save',
                    }
                });
            }
        });
    }

    /**
     * Save a new Purchase Account
     * @param type
     * @param leave
     * @param repo 
     * @param manager 
     * @returns 
     */
    private _saveNewPurchaseAccount(
        type?: { account: any },
        repo?: string,
        manager?: EntityManager,
    ): Promise<PurchaseAccountEntity | any> {
        return this.useTransaction(async transaction => {
            if (type) {
                // Create new Upload
                const newUpload = new PurchaseAccountEntity({
                    active: true,

                });
                newUpload.account = type.account;

                // Save new upload
                const savedUpload = await transaction.save(newUpload);

                if (savedUpload) {
                    return this.findOne(savedUpload.id, repo, transaction);
                }
            } else {
                return {
                    error: {
                        message: 'No Purchase Account',
                    }
                };
            }
        }, (manager || repo));
    }

    /** 
     *Return data with pagination
     * @param sort 
     * @param pagination 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findPurchaseAccountAndPaginationAll(
        filter: PurchaseAccountFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PurchaseAccountPaginationResultInterface> {
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
        id: number | PurchaseAccountEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PurchaseAccountEntity> {
        if (id instanceof PurchaseAccountEntity) id = id.id;
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
    ): Promise<PurchaseAccountEntity> {
        const qb = this._initSelect(repo, manager);

        if (PurchaseAccountEntity.isColumnString(column)) {
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
        data: PurchaseAccountCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PurchaseAccountEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const PurchaseAccount = new PurchaseAccountEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(PurchaseAccount, rest);

            // Save hit
            const result = await transaction.save(PurchaseAccount);

            if (result) {
                this._logger.create(PurchaseAccount);

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
        data: PurchaseAccountUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PurchaseAccountEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldPurchaseAccount = await this.findOne(id, repo, transaction);

            if (oldPurchaseAccount) {
                // Set old data
                this._logger.setOldData(oldPurchaseAccount);

                // Add new Data
                Object.assign(oldPurchaseAccount, req);

                // Save Data
                const result = await transaction.save(oldPurchaseAccount);

                if (result) {
                    this._logger.update(oldPurchaseAccount);

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
        req: PurchaseAccountRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof PurchaseAccountEntity ? id.id : id;
                const PurchaseAccount = await this.findOne(id, repo, transaction);

                if (PurchaseAccount instanceof PurchaseAccountEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(PurchaseAccountEntity, PurchaseAccount.id);

                        this._logger.delete(PurchaseAccount);
                    } else {
                        await transaction.softDelete(PurchaseAccountEntity, PurchaseAccount.id);

                        this._logger.softDelete(PurchaseAccount);
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
    ): SelectQueryBuilder<PurchaseAccountEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('pa', manager?.queryRunner)
            .leftJoinAndSelect('pa.sectionCode', 'sc');


        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<PurchaseAccountEntity>,
        filter?: PurchaseAccountFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('name')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.sectionCodeId) qb.andWhere(`${this._cn('sectionCodeId')} ILIKE :sectionCodeId`, { sectionCodeId: `%${filter.sectionCodeId}%` });

            if (filter.sectionCodeIds?.length) qb.andWhere(`${this._cn('sectionCodeIds')} IN (:...sectionCodeIds)`, { sectionCodeIds: filter.sectionCodeIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<PurchaseAccountEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return PurchaseAccountService.ColumnQueryNames.get(columnName);
    }

}
