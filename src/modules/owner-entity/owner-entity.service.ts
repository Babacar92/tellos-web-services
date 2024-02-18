import { Inject, Injectable } from '@nestjs/common';
import { OwnerEntity } from 'src/entities/psql/owner-entity.entity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import {
    Brackets,
    DataSource,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { OwnerEntityCreateArgInput } from './dto/args/owner-entity.create.arg.input';
import { OwnerEntityFilterArgInput } from './dto/args/owner-entity.filter.arg.input';
import { OwnerEntityRemoveArgInput } from './dto/args/owner-entity.remove.arg.input';
import { OwnerEntityUpdateArgInput } from './dto/args/owner-entity.update.arg.input';
import { OwnerEntityPaginationResultInterface } from './dto/interfaces/owner-entity.pagination.result.interface';
import { OwnerEntityLogger } from './logger/owner-entity.logger';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';

enum DatabaseAliasEnum {
    OWNER_ENTITY = 'oe',
}

@Injectable()
export class OwnerEntityService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.OWNER_ENTITY}.id`],
        ['name', `${DatabaseAliasEnum.OWNER_ENTITY}.name`],
        ['address', `${DatabaseAliasEnum.OWNER_ENTITY}.address`],
        ['addressBis', `${DatabaseAliasEnum.OWNER_ENTITY}.addressBis`],
        ['postcode', `${DatabaseAliasEnum.OWNER_ENTITY}.postcode`],
        ['city', `${DatabaseAliasEnum.OWNER_ENTITY}.city`],
        ['country', `${DatabaseAliasEnum.OWNER_ENTITY}.country`],
        ['phone', `${DatabaseAliasEnum.OWNER_ENTITY}.phone`],
        ['siret', `${DatabaseAliasEnum.OWNER_ENTITY}.siret`],
        ['ape', `${DatabaseAliasEnum.OWNER_ENTITY}.ape`],
        ['createdAt', `${DatabaseAliasEnum.OWNER_ENTITY}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.OWNER_ENTITY}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.OWNER_ENTITY}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.OWNER_ENTITY}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.OWNER_ENTITY}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: OwnerEntityLogger,
    ) {
        super();
    }

    public async findOwnerEntitiesByIds(ids: number[]): Promise<OwnerEntity[]> {
        const data = await this.dataSource
            .getRepository(OwnerEntity)
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
        id?: number | OwnerEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof OwnerEntity) id = id.id;

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
        id?: number | OwnerEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof OwnerEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.OWNER_ENTITY}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (OwnerEntity.isColumnString(column)) {
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
        filter?: OwnerEntityFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<OwnerEntity[]> {
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
    public async findOwnerEntitiesAndPaginationAll(
        filter: OwnerEntityFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<OwnerEntityPaginationResultInterface> {
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
        id: number | OwnerEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<OwnerEntity> {
        if (id instanceof OwnerEntity) id = id.id;
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
    ): Promise<OwnerEntity> {
        const qb = this._initSelect(repo, manager);

        if (OwnerEntity.isColumnString(column)) {
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
        data: OwnerEntityCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<OwnerEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const ownerEntity = new OwnerEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(ownerEntity, rest);

            // Save hit
            const result = await transaction.save(ownerEntity);

            if (result) {
                this._logger.create(ownerEntity);

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
        data: OwnerEntityUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<OwnerEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldOwnerEntity = await this.findOne(id, repo, transaction);

            if (oldOwnerEntity) {
                // Set old data
                this._logger.update(oldOwnerEntity);

                // Add new Data
                Object.assign(oldOwnerEntity, req);

                // Save Data
                const result = await transaction.save(oldOwnerEntity);

                if (result) {
                    this._logger.update(oldOwnerEntity);

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
        req: OwnerEntityRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof OwnerEntity ? id.id : id;
                const ownerEntity = await this.findOne(id, repo, transaction);

                if (ownerEntity instanceof OwnerEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(OwnerEntity, ownerEntity.id);

                        this._logger.delete(ownerEntity);
                    } else {
                        await transaction.softDelete(
                            OwnerEntity,
                            ownerEntity.id,
                        );

                        this._logger.softDelete(ownerEntity);
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
    ): SelectQueryBuilder<OwnerEntity> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.OWNER_ENTITY}`,
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
        qb: SelectQueryBuilder<OwnerEntity>,
        filter?: OwnerEntityFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.name)
                qb.andWhere(`${this._cn('name')} ILIKE :name`, {
                    name: `%${filter.name}%`,
                });

            if (filter.names?.length)
                qb.andWhere(`${this._cn('name')} IN (:...names)`, {
                    names: filter.names,
                });

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

    public getRepo(repo?: string): Repository<OwnerEntity> {
        return this.dataSource.getRepository(OwnerEntity);
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return OwnerEntityService.ColumnQueryNames.get(columnName);
    }
}
