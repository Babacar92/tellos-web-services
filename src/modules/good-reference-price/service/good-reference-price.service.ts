import { Inject, Injectable } from '@nestjs/common';
import { GoodReferencePriceEntity } from 'src/entities/psql/GoodReferencePriceEntity';
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
import { GoodReferencePriceCreateArgInput } from '../dto/args/good-reference-price.create.arg.input';
import { GoodReferencePriceFilterArgInput } from '../dto/args/good-reference-price.filter.arg.input';
import { GoodReferencePriceRemoveArgInput } from '../dto/args/good-reference-price.remove.arg.input';
import { GoodReferencePriceUpdateArgInput } from '../dto/args/good-reference-price.update.arg.input';
import { GoodReferencePricePaginationResultInterface } from '../dto/interfaces/good-reference-price.pagination.result.interface';
import { GOOD_REFERENCE_PRICE_PROVIDERS_NAMES } from '../dto/provider/good-reference-price.providers';
import { GoodReferencePriceLogger } from '../logger/good-reference-price.logger';
import { dateToTimestamp } from 'src/utils/utils';

enum DatabaseAliasEnum {
    GOOD_REFERENCE_PRICE = 'good_ref_pri',
    ENTITIES = 'ent',
    SUPPLIER = 'sup',
    WORK_UNIT = 'wu',
    GOOD = 'good',
}

@Injectable()
export class GoodReferencePriceService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.id`],
        [
            'executiveContract',
            `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.executiveContract`,
        ],
        ['startDate', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.startDate`],
        ['endDate', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.endDate`],
        ['price', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.price`],
        ['discount', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.discount`],
        ['netPrice', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.netPrice`],
        ['entities', `${DatabaseAliasEnum.ENTITIES}.id`],
        ['good', `${DatabaseAliasEnum.GOOD}.id`],
        ['supplier', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['active', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.active`],
        ['createdAt', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.updatedBy`],
    ]);

    /**
     * Constructor of GoodReferencePriceService
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(GOOD_REFERENCE_PRICE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<GoodReferencePriceEntity>,
        private readonly _logger: GoodReferencePriceLogger,
    ) {
        super();
    }

    /**
     * Check if Good Reference Price Exist
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async exist(
        id?: number | GoodReferencePriceEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof GoodReferencePriceEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Found Good Reference Price by column search and is value
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
        id?: number | GoodReferencePriceEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof GoodReferencePriceEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (GoodReferencePriceEntity.isColumnString(column)) {
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
     * Return all Good Reference Price
     * @param filter
     * @param sort
     * @param repo
     * @param manager
     * @returns
     */
    public async findAll(
        filter?: GoodReferencePriceFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<GoodReferencePriceEntity[]> {
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
    public async findGoodReferencePricesAndPaginationAll(
        filter: GoodReferencePriceFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<GoodReferencePricePaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Good Reference Price by his id
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async findOne(
        id: number | GoodReferencePriceEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<GoodReferencePriceEntity> {
        if (id instanceof GoodReferencePriceEntity) id = id.id;
        return this.findByColumn('id', id, repo, manager);
    }

    /**
     * Return an existing Good Reference Price by his column value
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
    ): Promise<GoodReferencePriceEntity> {
        const qb = this._initSelect(repo, manager);

        if (GoodReferencePriceEntity.isColumnString(column)) {
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
     * Create new Good Reference Price
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: GoodReferencePriceCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<GoodReferencePriceEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const goodReferencePrice = new GoodReferencePriceEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(goodReferencePrice, rest);

            // Save hit
            const result = await transaction.save(goodReferencePrice);

            if (result) {
                this._logger.create(goodReferencePrice);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update new Good Reference Price
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: GoodReferencePriceUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<GoodReferencePriceEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldGoodReferencePrice = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldGoodReferencePrice) {
                // Set old data
                this._logger.update(oldGoodReferencePrice);

                // Add new Data
                Object.assign(oldGoodReferencePrice, req);

                // Save Data
                const result = await transaction.save(oldGoodReferencePrice);

                if (result) {
                    this._logger.update(oldGoodReferencePrice);

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
        req: GoodReferencePriceRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id } = req;
                const type = req.type;

                id = id instanceof GoodReferencePriceEntity ? id.id : id;
                const goodReferencePrice = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (goodReferencePrice instanceof GoodReferencePriceEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            GoodReferencePriceEntity,
                            goodReferencePrice.id,
                        );

                        this._logger.delete(goodReferencePrice);
                    } else {
                        await transaction.softDelete(
                            GoodReferencePriceEntity,
                            goodReferencePrice.id,
                        );

                        this._logger.softDelete(goodReferencePrice);
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
    ): SelectQueryBuilder<GoodReferencePriceEntity> {
        return this.getRepo(repo)
            .createQueryBuilder(
                `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}`,
                manager?.queryRunner,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.entities`,
                `${DatabaseAliasEnum.ENTITIES}`,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.workUnit`,
                `${DatabaseAliasEnum.WORK_UNIT}`,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.supplier`,
                `${DatabaseAliasEnum.SUPPLIER}`,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD_REFERENCE_PRICE}.good`,
                `${DatabaseAliasEnum.GOOD}`,
            );
    }

    /**
     * Apply user filter
     * @param qb
     * @param filter
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<GoodReferencePriceEntity>,
        filter?: GoodReferencePriceFilterArgInput,
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

            if (filter.supplier)
                qb.andWhere(`${this._cn('supplier')} = :supplier`, {
                    supplier: filter.supplier,
                });

            if (filter.good)
                qb.andWhere(`${this._cn('good')} = :good`, {
                    good: filter.good,
                });

            if (filter.entities?.length)
                qb.andWhere(`${this._cn('entities')} IN (:...entities)`, {
                    entities: filter.entities,
                });

            if (filter.price != null)
                qb.andWhere(`${this._cn('price')} = :price`, {
                    price: filter.price,
                });

            if (filter.discount != null)
                qb.andWhere(`${this._cn('discount')} = :discount`, {
                    discount: filter.discount,
                });

            if (filter.netPrice != null) {
                qb.andWhere(`${this._cn('netPrice')} = :netPrice`, {
                    netPrice: filter.netPrice,
                });
            }

            //Date Query
            let startDateTransormed: string, endDateTransormed: string;
            //Start Date and End Date have been entered
            if (filter.startDate && filter.endDate) {
                startDateTransormed = dateToTimestamp(filter.startDate, 'date');
                endDateTransormed = dateToTimestamp(filter.endDate, 'date');
                qb.andWhere(
                    new Brackets((_qb) => {
                        //1 - The Date Range is between the start date only
                        _qb.orWhere(
                            `to_char(${this._cn(
                                'startDate',
                            )}, 'YYYY-MM-DD') > :startDate AND to_char(${this._cn(
                                'startDate',
                            )}, 'YYYY-MM-DD') <= :endDate`,
                            {
                                startDate: startDateTransormed,
                                endDate: endDateTransormed,
                            },
                        );
                        //2 - The Date Range is between the start date and the end date
                        _qb.orWhere(
                            `to_char(${this._cn(
                                'startDate',
                            )}, 'YYYY-MM-DD') <= :startDate AND to_char(${this._cn(
                                'endDate',
                            )}, 'YYYY-MM-DD') >= :endDate`,
                            {
                                startDate: startDateTransormed,
                                endDate: endDateTransormed,
                            },
                        );
                        //3 - The Date Range is between the end date only
                        _qb.orWhere(
                            `to_char(${this._cn(
                                'endDate',
                            )}, 'YYYY-MM-DD') >= :startDate AND to_char(${this._cn(
                                'endDate',
                            )}, 'YYYY-MM-DD') < :endDate`,
                            {
                                startDate: startDateTransormed,
                                endDate: endDateTransormed,
                            },
                        );
                    }),
                );
            }
            //Only Start Date or End Date
            else if (filter.startDate || filter.endDate) {
                let searchDate = null;
                filter.startDate
                    ? (searchDate = filter.startDate)
                    : (searchDate = filter.endDate);
                const searchDateTransformed = dateToTimestamp(
                    searchDate,
                    'date',
                );
                qb.andWhere(
                    `to_char(${this._cn(
                        'startDate',
                    )}, 'YYYY-MM-DD') <= :startDate`,
                    { startDate: searchDateTransformed },
                );
                qb.andWhere(
                    `to_char(${this._cn('endDate')}, 'YYYY-MM-DD') >= :endDate`,
                    { endDate: searchDateTransformed },
                );
            }

            //Executive Contract
            if (filter.executiveContract != null)
                qb.andWhere(
                    `${this._cn('executiveContract')} = :executiveContract`,
                    {
                        executiveContract: filter.executiveContract,
                    },
                );

            // General search
            if (filter.search && typeof filter.search == 'number') {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('price')} = :search)`, {
                            search: filter.search,
                        });
                        _qb.orWhere(`(${this._cn('discount')} = :search)`, {
                            search: filter.search,
                        });
                        _qb.orWhere(`(${this._cn('netPrice')} = :search)`, {
                            search: filter.search,
                        });
                    }),
                );
            }
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<GoodReferencePriceEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return GoodReferencePriceService.ColumnQueryNames.get(columnName);
    }
}
