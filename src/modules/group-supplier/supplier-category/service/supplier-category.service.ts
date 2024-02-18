import { Inject, Injectable } from '@nestjs/common';
import { SupplierCategoryEntity } from 'src/entities/psql/SupplierCategoryEntity';
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
import { SupplierCategoryCreateArgInput } from '../dto/args/supplier-category.create.arg.input';
import { SupplierCategoryFilterArgInput } from '../dto/args/supplier-category.filter.arg.input';
import { SupplierCategoryRemoveArgInput } from '../dto/args/supplier-category.remove.arg.input';
import { SupplierCategoryUpdateArgInput } from '../dto/args/supplier-category.update.arg.input';
import { SupplierCategoryPaginationResultInterface } from '../dto/interfaces/supplier-category.pagination.result.interface';
import { SUPPLIER_CATEGORY_PROVIDERS_NAMES } from '../dto/provider/supplier-category.providers';
import { SupplierCategoryLogger } from '../logger/supplier-category.logger';

enum DatabaseAliasEnum {
    SUPPLIER_CATEGORY = 'sc',
}

@Injectable()
export class SupplierCategoryService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.id`],
        ['name', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.name`],
        ['active', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.active`],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(SUPPLIER_CATEGORY_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<SupplierCategoryEntity>,
        private readonly _logger: SupplierCategoryLogger,
    ) {
        super();
    }

    //Find Suppliers By Ids
    public async findSupplierCategoryByIds(
        ids: number[],
    ): Promise<SupplierCategoryEntity[] | Error> {
        try {
            const data = await this._defaultUserRepository.find({
                where: { id: In(ids) },
            });

            return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
        } catch (e) {
            throw new Error(e.message || 'Cannot find any supplier category');
        }
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
        id?: number | SupplierCategoryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof SupplierCategoryEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Found Quick Access by column search and is value
     * @param value
     * @param column
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async existByColumn(
        value: any,
        column: string,
        id?: number | SupplierCategoryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof SupplierCategoryEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.SUPPLIER_CATEGORY}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (SupplierCategoryEntity.isColumnString(column)) {
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
     * @param filter
     * @param sort
     * @param repo
     * @param manager
     * @returns
     */
    public async findAll(
        filter?: SupplierCategoryFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierCategoryEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }

    /**
     * Return data with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param repo
     * @param manager
     * @returns
     */
    public async findSupplierCategoriesAndPaginationAll(
        filter: SupplierCategoryFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierCategoryPaginationResultInterface> {
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
        id: number | SupplierCategoryEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierCategoryEntity> {
        if (id instanceof SupplierCategoryEntity) id = id.id;
        return this.findByColumn('id', id, repo, manager);
    }

    /**
     * Return an existing user by his column value
     * @param column
     * @param value
     * @param repo
     * @param manager
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierCategoryEntity> {
        const qb = this._initSelect(repo, manager);

        if (SupplierCategoryEntity.isColumnString(column)) {
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
        data: SupplierCategoryCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierCategoryEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const supplierCategory = new SupplierCategoryEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(supplierCategory, rest);

            // Save hit
            const result = await transaction.save(supplierCategory);

            if (result) {
                this._logger.create(supplierCategory);

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
        data: SupplierCategoryUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierCategoryEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldSupplierCategory = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldSupplierCategory) {
                // Set old data
                this._logger.update(oldSupplierCategory);

                // Add new Data
                Object.assign(oldSupplierCategory, req);

                // Save Data
                const result = await transaction.save(oldSupplierCategory);

                if (result) {
                    this._logger.update(oldSupplierCategory);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, manager || repo);
    }

    /**
     * Update an existing entity
     * @param req
     * @param repo
     * @param manager
     * @returns
     */
    public async remove(
        req: SupplierCategoryRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof SupplierCategoryEntity ? id.id : id;
                const supplierCategory = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (supplierCategory instanceof SupplierCategoryEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            SupplierCategoryEntity,
                            supplierCategory.id,
                        );

                        this._logger.delete(supplierCategory);
                    } else {
                        await transaction.softDelete(
                            SupplierCategoryEntity,
                            supplierCategory.id,
                        );

                        this._logger.softDelete(supplierCategory);
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
     * @param manager
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<SupplierCategoryEntity> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.SUPPLIER_CATEGORY}`,
            manager?.queryRunner,
        );
    }

    /**
     * Apply user filter
     * @param qb
     * @param filter
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<SupplierCategoryEntity>,
        filter?: SupplierCategoryFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            // Search on id
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            // Search on name
            if (filter.name)
                qb.andWhere(`${this._cn('name')} ILIKE :name`, {
                    name: `%${filter.name}%`,
                });

            // General search
            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('name')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<SupplierCategoryEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return SupplierCategoryService.ColumnQueryNames.get(columnName);
    }
}
