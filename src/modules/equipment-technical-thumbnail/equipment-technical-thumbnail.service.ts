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
import { EquipmentTechnicalThumbnailCreateArgInput } from './dto/args/equipment-technical-thumbnail.create.arg.input';
import { EquipmentTechnicalThumbnailFilterArgInput } from './dto/args/equipment-technical-thumbnail.filter.arg.input';
import { EquipmentTechnicalThumbnailRemoveArgInput } from './dto/args/equipment-technical-thumbnail.remove.arg.input';
import { EquipmentTechnicalThumbnailUpdateArgInput } from './dto/args/equipment-technical-thumbnail.update.arg.input';
import { EquipmentTechnicalThumbnailPaginationResultInterface } from './dto/interfaces/equipment-technical-thumbnail.pagination.result.interface';
import { EquipmentTechnicalThumbnailLogger } from './logger/equipment-technical-thumbnail.logger';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';
import { EquipmentTechnicalThumbnail } from '@/entities/psql/equipment-technical-thumbnail.entity';

enum DatabaseAliasEnum {
    EQUIPMENT_TECHNICAL_THUMBNAIL = 'ett',
}

@Injectable()
export class EquipmentTechnicalThumbnailService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}.id`],
        ['value', `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}.value`],
        [
            'createdAt',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}.createdAt`,
        ],
        [
            'updatedAt',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}.updatedAt`,
        ],
        [
            'deletedAt',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}.deletedAt`,
        ],
        [
            'createdBy',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}.createdBy`,
        ],
        [
            'updatedBy',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}.updatedBy`,
        ],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: EquipmentTechnicalThumbnailLogger,
    ) {
        super();
    }

    public async findEquipmentTechnicalThumbnailsByIds(
        ids: number[],
    ): Promise<EquipmentTechnicalThumbnail[]> {
        const data = await this.dataSource
            .getRepository(EquipmentTechnicalThumbnail)
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
        id?: number | EquipmentTechnicalThumbnail,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EquipmentTechnicalThumbnail) id = id.id;

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
        id?: number | EquipmentTechnicalThumbnail,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof EquipmentTechnicalThumbnail) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (EquipmentTechnicalThumbnail.isColumnString(column)) {
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
        filter?: EquipmentTechnicalThumbnailFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalThumbnail[]> {
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
    public async findEquipmentTechnicalThumbnailsAndPaginationAll(
        filter: EquipmentTechnicalThumbnailFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalThumbnailPaginationResultInterface> {
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
        id: number | EquipmentTechnicalThumbnail,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalThumbnail> {
        if (id instanceof EquipmentTechnicalThumbnail) id = id.id;
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
    ): Promise<EquipmentTechnicalThumbnail> {
        const qb = this._initSelect(repo, manager);

        if (EquipmentTechnicalThumbnail.isColumnString(column)) {
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
        data: EquipmentTechnicalThumbnailCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalThumbnail> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const equipmentTechnicalThumbnail =
                new EquipmentTechnicalThumbnail();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(equipmentTechnicalThumbnail, rest);

            // Save hit
            const result = await transaction.save(equipmentTechnicalThumbnail);

            if (result) {
                this._logger.create(equipmentTechnicalThumbnail);

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
        data: EquipmentTechnicalThumbnailUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalThumbnail> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const EquipmentTechnicalThumbnail = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (EquipmentTechnicalThumbnail) {
                // Set old data
                this._logger.update(EquipmentTechnicalThumbnail);

                // Add new Data
                Object.assign(EquipmentTechnicalThumbnail, req);

                // Save Data
                const result = await transaction.save(
                    EquipmentTechnicalThumbnail,
                );

                if (result) {
                    this._logger.update(EquipmentTechnicalThumbnail);

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
        req: EquipmentTechnicalThumbnailRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof EquipmentTechnicalThumbnail ? id.id : id;
                const equipmentTechnicalThumbnail = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (
                    equipmentTechnicalThumbnail instanceof
                    EquipmentTechnicalThumbnail
                ) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            EquipmentTechnicalThumbnail,
                            equipmentTechnicalThumbnail.id,
                        );

                        this._logger.delete(equipmentTechnicalThumbnail);
                    } else {
                        await transaction.softDelete(
                            EquipmentTechnicalThumbnail,
                            equipmentTechnicalThumbnail.id,
                        );

                        this._logger.softDelete(equipmentTechnicalThumbnail);
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
    ): SelectQueryBuilder<EquipmentTechnicalThumbnail> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_THUMBNAIL}`,
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
        qb: SelectQueryBuilder<EquipmentTechnicalThumbnail>,
        filter?: EquipmentTechnicalThumbnailFilterArgInput,
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
                qb.andWhere(`${this._cn('value')} ILIKE :value`, {
                    value: `%${filter.value}%`,
                });

            if (filter.values?.length)
                qb.andWhere(`${this._cn('value')} IN (:...values)`, {
                    values: filter.values,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('value')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<EquipmentTechnicalThumbnail> {
        return this.dataSource.getRepository(EquipmentTechnicalThumbnail);
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return EquipmentTechnicalThumbnailService.ColumnQueryNames.get(
            columnName,
        );
    }
}
