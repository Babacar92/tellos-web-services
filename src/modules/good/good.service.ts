import { Inject, Injectable } from '@nestjs/common';
import { Good } from 'src/entities/psql/good.entity';
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
import { GoodCreateArgInput } from './dto/inputs/good.create.arg.input';
import { GoodFilterArgInput } from './dto/args/good.filter.args';
import { GoodRemoveArgInput } from './dto/inputs/good.remove.arg.input';
import { GoodUpdateArgInput } from './dto/inputs/good.update.arg.input';
import { GoodPaginationResultInterface } from './dto/responses/goods.response';
import { WORK_UNIT_PROVIDERS_NAMES } from './good.providers';
import { GoodLogger } from './logger/good.logger';

export enum DatabaseAliasEnum {
    GOOD = 'g',
    ARTICLE_PARENT_FAMILY = 'apf',
    ARTICLE_SUB_FAMILY = 'asf',
    SECTION_CODE = 'sc',
    WORK_UNIT = 'wu',
    SUPPLIER = 'sup',
}

@Injectable()
export class GoodService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.GOOD}.id`],
        ['name', `${DatabaseAliasEnum.GOOD}.name`],
        ['nameBis', `${DatabaseAliasEnum.GOOD}.nameBis`],
        ['shopGood', `${DatabaseAliasEnum.GOOD}.shopGood`],
        ['status', `${DatabaseAliasEnum.GOOD}.status`],
        ['ean', `${DatabaseAliasEnum.GOOD}.ean`],
        ['lengthSize', `${DatabaseAliasEnum.GOOD}.lengthSize`],
        ['widthSize', `${DatabaseAliasEnum.GOOD}.widthSize`],
        ['heightSize', `${DatabaseAliasEnum.GOOD}.heightSize`],
        ['volume', `${DatabaseAliasEnum.GOOD}.volume`],
        ['grossWeight', `${DatabaseAliasEnum.GOOD}.grossWeight`],
        ['netWeight', `${DatabaseAliasEnum.GOOD}.netWeight`],
        [
            'technicalDescription',
            `${DatabaseAliasEnum.GOOD}.technicalDescription`,
        ],
        ['selectionActive', `${DatabaseAliasEnum.GOOD}.selectionActive`],
        ['stockManagement', `${DatabaseAliasEnum.GOOD}.stockManagement`],
        ['isGeneric', `${DatabaseAliasEnum.GOOD}.isGeneric`],
        ['workUnit', `${DatabaseAliasEnum.WORK_UNIT}.id`],
        ['supplier', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['sectionCode', `${DatabaseAliasEnum.SECTION_CODE}.id`],
        ['parentFamily', `${DatabaseAliasEnum.ARTICLE_PARENT_FAMILY}.id`],
        ['subFamily', `${DatabaseAliasEnum.ARTICLE_SUB_FAMILY}.id`],
        ['active', `${DatabaseAliasEnum.GOOD}.active`],
        ['createdAt', `${DatabaseAliasEnum.GOOD}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.GOOD}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.GOOD}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.GOOD}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.GOOD}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     */
    public constructor(
        @Inject(WORK_UNIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<Good>,
        private readonly _logger: GoodLogger,
    ) {
        super();
    }

    async findGoodsByIds(ids: number[]): Promise<Good[]> {
        return this._defaultUserRepository.find({
            where: { id: In(ids) },
        });
    }

    /**
     * Check if Good Exist
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async exist(
        id?: number | Good,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof Good) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Found Good by column search and is value
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
        id?: number | Good,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof Good) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'g',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (Good.isColumnString(column)) {
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
     * Return all Good
     * @param filter
     * @param sort
     * @param repo
     * @param manager
     * @returns
     */
    public async findAll(
        filter?: GoodFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Good[]> {
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
    public async findGoodsAndPaginationAll(
        filter: GoodFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<GoodPaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Good by his id
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async findOne(
        id: number | Good,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Good> {
        if (id instanceof Good) id = id.id;
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
    ): Promise<Good> {
        const qb = this._initSelect(repo, manager);

        if (Good.isColumnString(column)) {
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
     * Create new Good
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: GoodCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Good> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Good
            const good = new Good();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(good, rest);

            // Save hit
            const result = await transaction.save(good);

            if (result) {
                this._logger.create(good);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update new Good
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: GoodUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Good> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldGood = await this.findOne(id, repo, transaction);

            if (oldGood) {
                // Set old data
                this._logger.update(oldGood);

                // Add new Data
                Object.assign(oldGood, req);

                // Save Data
                const result = await transaction.save(oldGood);

                if (result) {
                    this._logger.update(oldGood);

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
        req: GoodRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id } = req;
                const { type } = req;

                id = id instanceof Good ? id.id : id;
                const good = await this.findOne(id, repo, transaction);

                if (good instanceof Good) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(Good, good.id);

                        this._logger.delete(good);
                    } else {
                        await transaction.softDelete(Good, good.id);

                        this._logger.softDelete(good);
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
    ): SelectQueryBuilder<Good> {
        return this.getRepo(repo)
            .createQueryBuilder('g', manager?.queryRunner)
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD}.parentFamily`,
                DatabaseAliasEnum.ARTICLE_PARENT_FAMILY,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD}.subFamily`,
                DatabaseAliasEnum.ARTICLE_SUB_FAMILY,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD}.sectionCode`,
                DatabaseAliasEnum.SECTION_CODE,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD}.workUnit`,
                DatabaseAliasEnum.WORK_UNIT,
            )
            .leftJoinAndSelect(
                `${DatabaseAliasEnum.GOOD}.supplier`,
                DatabaseAliasEnum.SUPPLIER,
            );
    }

    /**
     * Apply user filter
     * @param qb
     * @param filter
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<Good>,
        filter?: GoodFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.supplierId)
                qb.andWhere(`${this._cn('supplier')} = :supplier`, {
                    supplier: filter.supplierId,
                });

            if (filter.sectionCodeIds?.length)
                qb.andWhere(
                    `${this._cn('sectionCode')} IN (:...sectionCodeIds)`,
                    { sectionCodeIds: filter.sectionCodeIds },
                );

            if (filter.familyIds?.length)
                qb.andWhere(`${this._cn('parentFamily')} IN (:...familyIds)`, {
                    familyIds: filter.familyIds,
                });

            if (filter.subFamilyIds?.length)
                qb.andWhere(`${this._cn('subFamily')} IN (:...subFamilyIds)`, {
                    subFamilyIds: filter.subFamilyIds,
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

            if (filter.name)
                qb.andWhere(`${this._cn('name')} ILIKE :name`, {
                    name: `%${filter.name}%`,
                });

            if (filter.names?.length)
                qb.andWhere(`${this._cn('name')} IN (:...names)`, {
                    names: filter.names,
                });

            if (filter.nameBis)
                qb.andWhere(`${this._cn('nameBis')} ILIKE :nameBis`, {
                    nameBis: `%${filter.nameBis}%`,
                });

            if (filter.nameBises?.length)
                qb.andWhere(`${this._cn('nameBis')} IN (:...nameBises)`, {
                    nameBises: filter.nameBises,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<Good> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return GoodService.ColumnQueryNames.get(columnName);
    }
}
