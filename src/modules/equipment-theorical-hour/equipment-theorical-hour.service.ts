import { Inject, Injectable } from '@nestjs/common';

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
import { EquipmentTheoricalHourCreateArgInput } from './dto/args/equipment-theorical-hour.create.arg.input';
import { EquipmentTheoricalHourFilterArgInput } from './dto/args/equipment-theorical-hour.filter.arg.input';
import { EquipmentTheoricalHourRemoveArgInput } from './dto/args/equipment-theorical-hour.remove.arg.input';
import { EquipmentTheoricalHourUpdateArgInput } from './dto/args/equipment-theorical-hour.update.arg.input';
import { EquipmentTheoricalHourPaginationResultInterface } from './dto/interfaces/equipment-theorical-hour.pagination.result.interface';
import { EquipmentTheoricalHourLogger } from './logger/equipment-theorical-hour.logger';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';
import { EquipmentTheoricalHour } from '@/entities/psql/equipment-theorical-hour.entity';

enum DatabaseAliasEnum {
    EQUIPMENT_THEORICAL_HOUR = 'eth',
}

@Injectable()
export class EquipmentTheoricalHourService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}.id`],
        ['value', `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}.value`],
        [
            'createdAt',
            `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}.createdAt`,
        ],
        [
            'updatedAt',
            `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}.updatedAt`,
        ],
        [
            'deletedAt',
            `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}.deletedAt`,
        ],
        [
            'createdBy',
            `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}.createdBy`,
        ],
        [
            'updatedBy',
            `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}.updatedBy`,
        ],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: EquipmentTheoricalHourLogger,
    ) {
        super();
    }

    public async findEquipmentTheoricalHoursByIds(
        ids: number[],
    ): Promise<EquipmentTheoricalHour[]> {
        return this.dataSource
            .getRepository(EquipmentTheoricalHour)
            .find({ where: { id: In(ids) } });
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
        id?: number | EquipmentTheoricalHour,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EquipmentTheoricalHour) id = id.id;

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
        id?: number | EquipmentTheoricalHour,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof EquipmentTheoricalHour) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (EquipmentTheoricalHour.isColumnString(column)) {
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
        filter?: EquipmentTheoricalHourFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTheoricalHour[]> {
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
    public async findEquipmentTheoricalHoursAndPaginationAll(
        filter: EquipmentTheoricalHourFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTheoricalHourPaginationResultInterface> {
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
        id: number | EquipmentTheoricalHour,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTheoricalHour> {
        if (id instanceof EquipmentTheoricalHour) id = id.id;
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
    ): Promise<EquipmentTheoricalHour> {
        const qb = this._initSelect(repo, manager);

        if (EquipmentTheoricalHour.isColumnString(column)) {
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
        data: EquipmentTheoricalHourCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTheoricalHour> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const equipmentTheoricalHour = new EquipmentTheoricalHour();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(equipmentTheoricalHour, rest);

            // Save hit
            const result = await transaction.save(equipmentTheoricalHour);

            if (result) {
                this._logger.create(equipmentTheoricalHour);

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
        data: EquipmentTheoricalHourUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTheoricalHour> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const EquipmentTheoricalHour = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (EquipmentTheoricalHour) {
                // Set old data
                this._logger.update(EquipmentTheoricalHour);

                // Add new Data
                Object.assign(EquipmentTheoricalHour, req);

                // Save Data
                const result = await transaction.save(EquipmentTheoricalHour);

                if (result) {
                    this._logger.update(EquipmentTheoricalHour);

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
        req: EquipmentTheoricalHourRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof EquipmentTheoricalHour ? id.id : id;
                const equipmentTheoricalHour = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (equipmentTheoricalHour instanceof EquipmentTheoricalHour) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            EquipmentTheoricalHour,
                            equipmentTheoricalHour.id,
                        );

                        this._logger.delete(equipmentTheoricalHour);
                    } else {
                        await transaction.softDelete(
                            EquipmentTheoricalHour,
                            equipmentTheoricalHour.id,
                        );

                        this._logger.softDelete(equipmentTheoricalHour);
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
    ): SelectQueryBuilder<EquipmentTheoricalHour> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.EQUIPMENT_THEORICAL_HOUR}`,
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
        qb: SelectQueryBuilder<EquipmentTheoricalHour>,
        filter?: EquipmentTheoricalHourFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.value)
                qb.andWhere(`${this._cn('value')} = :value`, {
                    value: `${filter.value}`,
                });

            if (filter.values?.length)
                qb.andWhere(`${this._cn('value')} IN (:...values)`, {
                    values: filter.values,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('value')} = :search)`, {
                            search: `${filter.search}`,
                        });
                    }),
                );
            }
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<EquipmentTheoricalHour> {
        return this.dataSource.getRepository(EquipmentTheoricalHour);
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return EquipmentTheoricalHourService.ColumnQueryNames.get(columnName);
    }

    public async findFirst(): Promise<EquipmentTheoricalHour> {
        return (
            await this.dataSource
                .getRepository(EquipmentTheoricalHour)
                .find({ take: 1 })
        )[0];
    }
}
