import { Inject, Injectable } from '@nestjs/common';
import { EquipmentParkUnitEntity } from 'src/entities/psql/EquipmentParkUnitEntity';
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
import { EquipmentParkUnitCreateArgInput } from '../dto/args/equipment-park-unit.create.arg.input';
import { EquipmentParkUnitFilterArgInput } from '../dto/args/equipment-park-unit.filter.arg.input';
import { EquipmentParkUnitRemoveArgInput } from '../dto/args/equipment-park-unit.remove.arg.input';
import { EquipmentParkUnitUpdateArgInput } from '../dto/args/equipment-park-unit.update.arg.input';
import { EquipmentParkUnitPaginationResultInterface } from '../dto/interfaces/equipment-park-unit.pagination.result.interface';
import { STOCK_UNIT_PROVIDERS_NAMES } from '../dto/provider/equipment-park-unit.providers';
import { EquipmentParkUnitLogger } from '../logger/equipment-park-unit.logger';

@Injectable()
export class EquipmentParkUnitService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'dt.id'],
        ['title', 'dt.title'],
        ['active', 'dt.active'],
        ['createdAt', 'dt.createdAt'],
        ['updatedAt', 'dt.updatedAt'],
        ['deletedAt', 'dt.deletedAt'],
        ['createdBy', 'dt.createdBy'],
        ['updatedBy', 'dt.updatedBy'],
    ]);

    /**
     * Constructor of Work Unit service
     * @param _defaultWorkUnitRepository
     * @param _logger
     */
    public constructor(
        @Inject(STOCK_UNIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultWorkUnitRepository: Repository<EquipmentParkUnitEntity>,
        private readonly _logger: EquipmentParkUnitLogger,
    ) {
        super();
    }

    public async findEquipmentParkWorkUnitsByIds(
        ids: number[],
    ): Promise<EquipmentParkUnitEntity[]> {
        const data = await this._defaultWorkUnitRepository.find({
            where: { id: In(ids) },
        });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
    }

    /**
     * Check if Work Unit Exist
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async exist(
        id?: number | EquipmentParkUnitEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EquipmentParkUnitEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Found Work Unit by column search and is value
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
        id?: number | EquipmentParkUnitEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof EquipmentParkUnitEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'dt',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (EquipmentParkUnitEntity.isColumnString(column)) {
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
     * Return all Work Unit
     * @param filter
     * @param sort
     * @param repo
     * @param manager
     * @returns
     */
    public async findAll(
        filter?: EquipmentParkUnitFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentParkUnitEntity[]> {
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
    public async findEquipmentParkUnitsAndPaginationAll(
        filter: EquipmentParkUnitFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentParkUnitPaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Work Unit by his id
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async findOne(
        id: number | EquipmentParkUnitEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentParkUnitEntity> {
        if (id instanceof EquipmentParkUnitEntity) id = id.id;
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
    ): Promise<EquipmentParkUnitEntity> {
        const qb = this._initSelect(repo, manager);

        if (EquipmentParkUnitEntity.isColumnString(column)) {
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
     * Create new Work Unit
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: EquipmentParkUnitCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentParkUnitEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Work Unit
            const stockUnit = new EquipmentParkUnitEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(stockUnit, rest);

            // Save hit
            const result = await transaction.save(stockUnit);

            if (result) {
                this._logger.create(stockUnit);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update new Work Unit
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: EquipmentParkUnitUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentParkUnitEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldEquipmentParkUnit = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldEquipmentParkUnit) {
                // Set old data
                this._logger.update(oldEquipmentParkUnit);

                // Add new Data
                Object.assign(oldEquipmentParkUnit, req);

                // Save Data
                const result = await transaction.save(oldEquipmentParkUnit);

                if (result) {
                    this._logger.update(oldEquipmentParkUnit);

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
        req: EquipmentParkUnitRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof EquipmentParkUnitEntity ? id.id : id;
                const stockUnit = await this.findOne(id, repo, transaction);

                if (stockUnit instanceof EquipmentParkUnitEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            EquipmentParkUnitEntity,
                            stockUnit.id,
                        );

                        this._logger.delete(stockUnit);
                    } else {
                        await transaction.softDelete(
                            EquipmentParkUnitEntity,
                            stockUnit.id,
                        );

                        this._logger.softDelete(stockUnit);
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
    ): SelectQueryBuilder<EquipmentParkUnitEntity> {
        return this.getRepo(repo).createQueryBuilder(
            'dt',
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
        qb: SelectQueryBuilder<EquipmentParkUnitEntity>,
        filter?: EquipmentParkUnitFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }

            if (filter.title)
                qb.andWhere(`${this._cn('title')} ILIKE :title`, {
                    title: `%${filter.title}%`,
                });

            if (filter.titles?.length)
                qb.andWhere(`${this._cn('title')} IN (:...titles)`, {
                    titles: filter.titles,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<EquipmentParkUnitEntity> {
        return this._defaultWorkUnitRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return EquipmentParkUnitService.ColumnQueryNames.get(columnName);
    }
}
