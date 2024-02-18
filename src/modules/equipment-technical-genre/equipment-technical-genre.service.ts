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
import { EquipmentTechnicalGenreCreateArgInput } from './dto/args/equipment-technical-genre.create.arg.input';
import { EquipmentTechnicalGenreFilterArgInput } from './dto/args/equipment-technical-genre.filter.arg.input';
import { EquipmentTechnicalGenreRemoveArgInput } from './dto/args/equipment-technical-genre.remove.arg.input';
import { EquipmentTechnicalGenreUpdateArgInput } from './dto/args/equipment-technical-genre.update.arg.input';
import { EquipmentTechnicalGenrePaginationResultInterface } from './dto/interfaces/equipment-technical-genre.pagination.result.interface';
import { EquipmentTechnicalGenreLogger } from './logger/equipment-technical-genre.logger';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';
import { EquipmentTechnicalGenre } from '@/entities/psql/equipment-technical-genre.entity';

enum DatabaseAliasEnum {
    EQUIPMENT_TECHNICAL_GENRE = 'etg',
}

@Injectable()
export class EquipmentTechnicalGenreService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}.id`],
        ['name', `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}.name`],
        [
            'createdAt',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}.createdAt`,
        ],
        [
            'updatedAt',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}.updatedAt`,
        ],
        [
            'deletedAt',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}.deletedAt`,
        ],
        [
            'createdBy',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}.createdBy`,
        ],
        [
            'updatedBy',
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}.updatedBy`,
        ],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: EquipmentTechnicalGenreLogger,
    ) {
        super();
    }

    public async findEquipmentTechnicalGenresByIds(
        ids: number[],
    ): Promise<EquipmentTechnicalGenre[]> {
        const data = await this.dataSource
            .getRepository(EquipmentTechnicalGenre)
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
        id?: number | EquipmentTechnicalGenre,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EquipmentTechnicalGenre) id = id.id;

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
        id?: number | EquipmentTechnicalGenre,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof EquipmentTechnicalGenre) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}`,
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (EquipmentTechnicalGenre.isColumnString(column)) {
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
        filter?: EquipmentTechnicalGenreFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalGenre[]> {
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
    public async findEquipmentTechnicalGenresAndPaginationAll(
        filter: EquipmentTechnicalGenreFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalGenrePaginationResultInterface> {
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
        id: number | EquipmentTechnicalGenre,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalGenre> {
        if (id instanceof EquipmentTechnicalGenre) id = id.id;
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
    ): Promise<EquipmentTechnicalGenre> {
        const qb = this._initSelect(repo, manager);

        if (EquipmentTechnicalGenre.isColumnString(column)) {
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
        data: EquipmentTechnicalGenreCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalGenre> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const equipmentTechnicalGenre = new EquipmentTechnicalGenre();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(equipmentTechnicalGenre, rest);

            // Save hit
            const result = await transaction.save(equipmentTechnicalGenre);

            if (result) {
                this._logger.create(equipmentTechnicalGenre);

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
        data: EquipmentTechnicalGenreUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentTechnicalGenre> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const EquipmentTechnicalGenre = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (EquipmentTechnicalGenre) {
                // Set old data
                this._logger.update(EquipmentTechnicalGenre);

                // Add new Data
                Object.assign(EquipmentTechnicalGenre, req);

                // Save Data
                const result = await transaction.save(EquipmentTechnicalGenre);

                if (result) {
                    this._logger.update(EquipmentTechnicalGenre);

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
        req: EquipmentTechnicalGenreRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof EquipmentTechnicalGenre ? id.id : id;
                const equipmentTechnicalGenre = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (
                    equipmentTechnicalGenre instanceof EquipmentTechnicalGenre
                ) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            EquipmentTechnicalGenre,
                            equipmentTechnicalGenre.id,
                        );

                        this._logger.delete(equipmentTechnicalGenre);
                    } else {
                        await transaction.softDelete(
                            EquipmentTechnicalGenre,
                            equipmentTechnicalGenre.id,
                        );

                        this._logger.softDelete(equipmentTechnicalGenre);
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
    ): SelectQueryBuilder<EquipmentTechnicalGenre> {
        return this.getRepo(repo).createQueryBuilder(
            `${DatabaseAliasEnum.EQUIPMENT_TECHNICAL_GENRE}`,
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
        qb: SelectQueryBuilder<EquipmentTechnicalGenre>,
        filter?: EquipmentTechnicalGenreFilterArgInput,
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

    public getRepo(repo?: string): Repository<EquipmentTechnicalGenre> {
        return this.dataSource.getRepository(EquipmentTechnicalGenre);
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return EquipmentTechnicalGenreService.ColumnQueryNames.get(columnName);
    }
}
