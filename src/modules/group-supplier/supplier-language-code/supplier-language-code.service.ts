import { Inject, Injectable } from '@nestjs/common';
import { SupplierLanguageCodeEntity } from 'src/entities/psql/SupplierLanguageCodeEntity';
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
import { SupplierLanguageCodeLogger } from './logger/supplier-language-code.logger';
import { SUPPLIER_LANGUAGE_CODE_PROVIDERS_NAMES } from './supplier-language-code.provider';
import { SupplierLanguageCodeCreateInput } from './dto/inputs/supplier-language-code.create.input';
import { SupplierLanguageCodeUpdateInput } from './dto/inputs/supplier-language-code.update.input';
import { SupplierLanguageCodeRemoveInput } from './dto/inputs/supplier-language-code.remove.input';
import { SupplierLanguageCodeFilterArgs } from './dto/args/supplier-language-code.filter.args';
import { SupplierLanguageCodesResponse } from './responses/supplier-language-codes.response';



enum DatabaseAliasEnum {
    SUPPLIER_LANGUAGE_CODE = 'sc',
}

@Injectable()
export class SupplierLanguageCodeService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.id`],
        ['name', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.name`],
        ['code', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.code`],
        ['active', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.active`],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(SUPPLIER_LANGUAGE_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<SupplierLanguageCodeEntity>,
        private readonly _logger: SupplierLanguageCodeLogger,
    ) {
        super();
    }

    //Find Suppliers By Ids
    public async findSupplierLanguageCodeByIds(
        ids: number[],
    ): Promise<SupplierLanguageCodeEntity[] | Error> {
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
        id?: number | SupplierLanguageCodeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof SupplierLanguageCodeEntity) id = id.id;

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
        id?: number | SupplierLanguageCodeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof SupplierLanguageCodeEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (SupplierLanguageCodeEntity.isColumnString(column)) {
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
        filter?: SupplierLanguageCodeCreateInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierLanguageCodeEntity[]> {
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
    public async findSupplierLanguageCodesAndPaginationAll(
        filter: SupplierLanguageCodeFilterArgs,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierLanguageCodesResponse> {
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
        id: number | SupplierLanguageCodeEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierLanguageCodeEntity> {
        if (id instanceof SupplierLanguageCodeEntity) id = id.id;
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
    ): Promise<SupplierLanguageCodeEntity> {
        const qb = this._initSelect(repo, manager);

        if (SupplierLanguageCodeEntity.isColumnString(column)) {
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
        data: SupplierLanguageCodeCreateInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierLanguageCodeEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const supplierLanguageCode = new SupplierLanguageCodeEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(supplierLanguageCode, rest);

            // Save hit
            const result = await transaction.save(supplierLanguageCode);

            if (result) {
                this._logger.create(supplierLanguageCode);

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
        data: SupplierLanguageCodeUpdateInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierLanguageCodeEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldSupplierLanguageCode = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldSupplierLanguageCode) {
                // Set old data
                this._logger.update(oldSupplierLanguageCode);

                // Add new Data
                Object.assign(oldSupplierLanguageCode, req);

                // Save Data
                const result = await transaction.save(oldSupplierLanguageCode);

                if (result) {
                    this._logger.update(oldSupplierLanguageCode);

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
        req: SupplierLanguageCodeRemoveInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof SupplierLanguageCodeEntity ? id.id : id;
                const supplierLanguageCode = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (supplierLanguageCode instanceof SupplierLanguageCodeEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            SupplierLanguageCodeEntity,
                            supplierLanguageCode.id,
                        );

                        this._logger.delete(supplierLanguageCode);
                    } else {
                        await transaction.softDelete(
                            SupplierLanguageCodeEntity,
                            supplierLanguageCode.id,
                        );

                        this._logger.softDelete(supplierLanguageCode);
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
    ): SelectQueryBuilder<SupplierLanguageCodeEntity> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}`,
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
        qb: SelectQueryBuilder<SupplierLanguageCodeEntity>,
        filter?: SupplierLanguageCodeFilterArgs,
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

    public getRepo(repo?: string): Repository<SupplierLanguageCodeEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return SupplierLanguageCodeService.ColumnQueryNames.get(columnName);
    }
}
