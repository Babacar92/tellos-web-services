import { Inject, Injectable } from '@nestjs/common';
import { ObligationType } from '@/entities/psql/obligation-type.entity';
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
import { ObligationTypeCreateArgInput } from './dto/args/obligation-type.create.arg.input';
import { ObligationTypeFilterArgInput } from './dto/args/obligation-type.filter.arg.input';
import { ObligationTypeRemoveArgInput } from './dto/args/obligation-type.remove.arg.input';
import { ObligationTypeUpdateArgInput } from './dto/args/obligation-type.update.arg.input';
import { ObligationTypePaginationResultInterface } from './dto/interfaces/obligation-type.pagination.result.interface';
import { ObligationTypeLogger } from './logger/obligation-type.logger';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';

enum DatabaseAliasEnum {
    EQUIPMENT_FUNDING = 'ef',
}

@Injectable()
export class ObligationTypeService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.EQUIPMENT_FUNDING}.id`],
        ['name', `${DatabaseAliasEnum.EQUIPMENT_FUNDING}.name`],
        ['createdAt', `${DatabaseAliasEnum.EQUIPMENT_FUNDING}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.EQUIPMENT_FUNDING}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.EQUIPMENT_FUNDING}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.EQUIPMENT_FUNDING}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.EQUIPMENT_FUNDING}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: ObligationTypeLogger,
    ) {
        super();
    }

    public async findObligationTypesByIds(
        ids: number[],
    ): Promise<ObligationType[]> {
        const data = await this.dataSource
            .getRepository(ObligationType)
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
        id?: number | ObligationType,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ObligationType) id = id.id;

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
        id?: number | ObligationType,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof ObligationType) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.EQUIPMENT_FUNDING}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ObligationType.isColumnString(column)) {
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
        filter?: ObligationTypeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ObligationType[]> {
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
    public async findObligationTypesAndPaginationAll(
        filter: ObligationTypeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ObligationTypePaginationResultInterface> {
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
        id: number | ObligationType,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ObligationType> {
        if (id instanceof ObligationType) id = id.id;
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
    ): Promise<ObligationType> {
        const qb = this._initSelect(repo, manager);

        if (ObligationType.isColumnString(column)) {
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
        data: ObligationTypeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ObligationType> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const obligationType = new ObligationType();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(obligationType, rest);

            // Save hit
            const result = await transaction.save(obligationType);

            if (result) {
                this._logger.create(obligationType);

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
        data: ObligationTypeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ObligationType> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldObligationType = await this.findOne(id, repo, transaction);

            if (oldObligationType) {
                // Set old data
                this._logger.update(oldObligationType);

                // Add new Data
                Object.assign(oldObligationType, req);

                // Save Data
                const result = await transaction.save(oldObligationType);

                if (result) {
                    this._logger.update(oldObligationType);

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
        req: ObligationTypeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof ObligationType ? id.id : id;
                const obligationType = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (obligationType instanceof ObligationType) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            ObligationType,
                            obligationType.id,
                        );

                        this._logger.delete(ObligationType);
                    } else {
                        await transaction.softDelete(
                            ObligationType,
                            obligationType.id,
                        );

                        this._logger.softDelete(ObligationType);
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
    ): SelectQueryBuilder<ObligationType> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.EQUIPMENT_FUNDING}`,
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
        qb: SelectQueryBuilder<ObligationType>,
        filter?: ObligationTypeFilterArgInput,
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

    public getRepo(repo?: string): Repository<ObligationType> {
        return this.dataSource.getRepository(ObligationType);
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return ObligationTypeService.ColumnQueryNames.get(columnName);
    }
}
