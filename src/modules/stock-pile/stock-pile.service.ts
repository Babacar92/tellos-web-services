import { Inject, Injectable } from '@nestjs/common';
import { StockPile } from '@/entities/psql/stock-pile.entity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import {
    DataSource,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { StockPileCreateArgInput } from './dto/args/stock-pile.create.arg.input';
import { StockPileFilterArgInput } from './dto/args/stock-pile.filter.arg.input';
import { StockPileRemoveArgInput } from './dto/args/stock-pile.remove.arg.input';
import { StockPileUpdateArgInput } from './dto/args/stock-pile.update.arg.input';
import { StockPilePaginationResultInterface } from './dto/interfaces/stock-pile.pagination.result.interface';
import { StockPileLogger } from './logger/stock-pile.logger';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';
import { addFilters, addSearch, addSorting } from '@/libs/databases/utils/db.utils';

enum DatabaseAliasEnum {
    STOCK_PILE = 'ef',
}

@Injectable()
export class StockPileService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public columnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.STOCK_PILE}.id`],
        ['name', `${DatabaseAliasEnum.STOCK_PILE}.name`],
        ['code', `${DatabaseAliasEnum.STOCK_PILE}.code`],
        ['entityId', `${DatabaseAliasEnum.STOCK_PILE}.entity_id`],
        ['createdAt', `${DatabaseAliasEnum.STOCK_PILE}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.STOCK_PILE}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.STOCK_PILE}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.STOCK_PILE}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.STOCK_PILE}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: StockPileLogger,
    ) {
        super();
    }

    public async findStockPilesByIds(
        ids: number[],
    ): Promise<StockPile[]> {
        const data = await this.dataSource
            .getRepository(StockPile)
            .find({ where: { id: In(ids) } });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
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
        id?: number | StockPile,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof StockPile) id = id.id;

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
        id?: number | StockPile,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof StockPile) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.STOCK_PILE}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (StockPile.isColumnString(column)) {
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
        filter?: StockPileFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<StockPile[]> {
        const qb = this._initSelect(repo, manager);

        addFilters<StockPile, StockPileFilterArgInput>(qb,filter,this.columnQueryNames);
        addSorting<StockPile>(qb,sort,this.columnQueryNames);
        addSearch<StockPile>(qb,this.columnQueryNames,['name','code'],filter.search);

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
    public async findStockPilesAndPaginationAll(
        filter: StockPileFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<StockPilePaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

        addFilters<StockPile, StockPileFilterArgInput>(qb,filter,this.columnQueryNames);
        addSorting<StockPile>(qb,sort,this.columnQueryNames);
        addSearch<StockPile>(qb,this.columnQueryNames,['name','code'],filter.search);

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
        id: number | StockPile,
        repo?: string,
        manager?: EntityManager,
    ): Promise<StockPile> {
        if (id instanceof StockPile) id = id.id;
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
    ): Promise<StockPile> {
        const qb = this._initSelect(repo, manager);

        if (StockPile.isColumnString(column)) {
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
        data: StockPileCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<StockPile> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const stockPile = new StockPile();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(stockPile, rest);

            stockPile.entity_id = data.entity.id;

            const latestStockPile = (await transaction.getRepository(StockPile).find({ take: 1, order: { id: 'DESC' } })[0]);

            stockPile.code = String(latestStockPile ? latestStockPile.id : 1).padStart(2, '0');

            // Save hit
            const result = await transaction.save(stockPile);

            if (result) {
                this._logger.create(stockPile);

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
        data: StockPileUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<StockPile> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldStockPile = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldStockPile) {
                // Set old data
                this._logger.update(oldStockPile);

                // Add new Data
                Object.assign(oldStockPile, req);

                // Save Data
                const result = await transaction.update(StockPile, id ,oldStockPile);

                if (result) {
                    this._logger.update(oldStockPile);

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
        req: StockPileRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof StockPile ? id.id : id;
                const stockPile = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (stockPile instanceof StockPile) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            StockPile,
                            stockPile.id,
                        );

                        this._logger.delete(stockPile);
                    } else {
                        await transaction.softDelete(
                            StockPile,
                            stockPile.id,
                        );

                        this._logger.softDelete(stockPile);
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
    ): SelectQueryBuilder<StockPile> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.STOCK_PILE}`,
            manager?.queryRunner,
        );
    }

       public getRepo(repo?: string): Repository<StockPile> {
        return this.dataSource.getRepository(StockPile);
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return this.columnQueryNames.get(columnName);
    }
}
