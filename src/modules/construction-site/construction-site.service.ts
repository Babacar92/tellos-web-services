import { Inject, Injectable } from '@nestjs/common';

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
import { ConstructionSiteCreateArgInput } from './dto/args/construction-site-create.arg.input';
import { ConstructionSiteFilterArgInput } from './dto/args/construction-site.filter.arg.input';
import { ConstructionSiteRemoveArgInput } from './dto/args/construction-site.remove.arg.input';
import { ConstructionSiteLogger } from './logger/construction-site.logger';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';
import { ConstructionSite } from '@/entities/psql/construction-site.entity';
import { PaginatedResult } from '@/libs/databases/dto/interfaces/result.pagination.interface';
import { ConstructionSiteUpdateArgInput } from './dto/args/construction-site.update.arg.input';
import { addFilters, addSorting } from '@/libs/databases/utils/db.utils';

enum DatabaseAliasEnum {
    CONSTRUCTION_SITE = 'cs',
}

@Injectable()
export class ConstructionSiteService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.id`],
        ['ids', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.id`],
        ['entityId', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.entity_id`],
        ['entityIds', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.entity_id`],
        ['label', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.label`],
        ['code', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.code`],
        ['startDate', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.startDate`],
        ['endDate', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.endDate`],
        ['status', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.status`],
        ['createdAt', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.CONSTRUCTION_SITE}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: ConstructionSiteLogger,
    ) {
        super();
    }

    public async findConstructionSitesByIds(
        ids: number[],
    ): Promise<ConstructionSite[]> {
        const data = await this.dataSource
            .getRepository(ConstructionSite)
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
        id?: number | ConstructionSite,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ConstructionSite) id = id.id;

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
        id?: number | ConstructionSite,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof ConstructionSite) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.CONSTRUCTION_SITE}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ConstructionSite.isColumnString(column)) {
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
        filter?: ConstructionSiteFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ConstructionSite[]> {
        const qb = this._initSelect(repo, manager);

        const { startDate, endDate, ...filterRest } = filter;

        if (startDate) {
            qb.andWhere(`${this.ColumnQueryNames.get('startDate')} >= :date`, {
                date: startDate,
            });
        }

        if (endDate) {
            qb.andWhere(`${this.ColumnQueryNames.get('endDate')} <= :date`, {
                date: endDate,
            });
        }

        addFilters<ConstructionSite, ConstructionSiteFilterArgInput>(
            qb,
            filterRest,
            this.ColumnQueryNames,
        );

        addSorting<ConstructionSite>(qb, sort, this.ColumnQueryNames);

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
    public async findConstructionSiteAndPaginationAll(
        filter: ConstructionSiteFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PaginatedResult<ConstructionSite>> {
        const qb = this._initSelect(repo, manager);

        const { startDate, endDate, ...filterRest } = filter;

        if (startDate) {
            qb.andWhere(
                `${this.ColumnQueryNames.get('startDate')} >= :startDate`,
                {
                    startDate,
                },
            );
        }

        if (endDate) {
            qb.andWhere(`${this.ColumnQueryNames.get('endDate')} <= :endDate`, {
                endDate,
            });
        }

        addFilters(qb, filterRest, this.ColumnQueryNames);

        addSorting<ConstructionSite>(qb, sort, this.ColumnQueryNames);

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
        id: number | ConstructionSite,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ConstructionSite> {
        if (id instanceof ConstructionSite) id = id.id;
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
    ): Promise<ConstructionSite> {
        const qb = this._initSelect(repo, manager);

        if (ConstructionSite.isColumnString(column)) {
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
     * Create new construction site
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: ConstructionSiteCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ConstructionSite> {
        return this.useTransaction(async (transaction) => {
            const constructionSite = new ConstructionSite(data);

            // const order: FindOptionsOrder<ConstructionSiteIdentifier> =
            //     data.from ? { subIdentifier: 'DESC' } : { identifier: 'DESC' };

            // let constructionSiteIdentifier = await transaction
            //     .getRepository(ConstructionSiteIdentifier)
            //     .find({
            //         where: {
            //             entity_id: data.entity.id,
            //         },
            //         order,
            //     });

            // if (!constructionSiteIdentifier) {
            //     if (!data.from) {
            //         constructionSiteIdentifier = await transaction.getRepository(ConstructionSiteIdentifier).save({
            //             ide
            //         })
            //     }
            // }

            const latestConstructionSite = (
                await transaction.getRepository(ConstructionSite).find({
                    order: { id: 'DESC' },
                    take: 1,
                })
            )[0];

            const code = latestConstructionSite
                ? latestConstructionSite.id + 1
                : 1;

            constructionSite.code = code.toString();

            const result = await transaction.save(constructionSite);

            if (result) {
                this._logger.create(constructionSite);

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
        data: ConstructionSiteUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ConstructionSite> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const constructionSite = await this.findOne(id, repo, transaction);

            if (constructionSite) {
                // Set old data
                this._logger.update(constructionSite);

                // Add new Data
                Object.assign(constructionSite, req);

                // Save Data
                const result = await transaction.save(constructionSite);

                if (result) {
                    this._logger.update(constructionSite);

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
        req: ConstructionSiteRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id } = req;
                const { type } = req;

                id = id instanceof ConstructionSite ? id.id : id;
                const constructionSite = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (constructionSite instanceof ConstructionSite) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            ConstructionSite,
                            constructionSite.id,
                        );

                        this._logger.delete(constructionSite);
                    } else {
                        await transaction.softDelete(
                            ConstructionSite,
                            constructionSite.id,
                        );

                        this._logger.softDelete(constructionSite);
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
    ): SelectQueryBuilder<ConstructionSite> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.CONSTRUCTION_SITE}`,
            manager?.queryRunner,
        );
    }

    public getRepo(repo?: string): Repository<ConstructionSite> {
        return this.dataSource.getRepository(ConstructionSite);
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return this.ColumnQueryNames.get(columnName);
    }
}
