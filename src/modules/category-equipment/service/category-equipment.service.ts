import { Inject, Injectable } from '@nestjs/common';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
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
import { CategoryEquipmentCreateArgInput } from '../dto/args/category-equipment.create.arg.input';
import { CategoryEquipmentFilterArgInput } from '../dto/args/category-equipment.filter.arg.input';
import { CategoryEquipmentRemoveArgInput } from '../dto/args/category-equipment.remove.arg.input';
import { CategoryEquipmentUpdateArgInput } from '../dto/args/category-equipment.update.arg.input';
import { CategoryEquipmentPaginationResultInterface } from '../dto/interfaces/category-equipment.pagination.result.interface';
import { CATEGORY_EQUIPMENT_PROVIDERS_NAMES } from '../dto/provider/category-equipment.providers';
import { CategoryEquipmentLogger } from '../logger/category-equipment.logger';
import { CategoryEquipmentFilterEquipmentRateArgInput } from '../dto/args/category-equipment.filter.for.equipment.rate.arg.input';

@Injectable()
export class CategoryEquipmentService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'ce.id'],
        ['code', 'ce.code'],
        ['title', 'ce.title'],
        ['price', 'er.price'],
        ['equipmentRateWorkUnit', 'er_wu.title'],
        ['formattedMediumSizedCentre', 'msc.label'],
        ['mediumSizedCentreId', 'msc.id'],
        ['mediumSizedCentre', 'msc.id'],
        ['mediumSizedCentre.code', 'msc.code'],
        ['mediumSizedCentre.label', 'msc.label'],
        ['active', 'ce.active'],
        ['createdAt', 'ce.createdAt'],
        ['updatedAt', 'ce.updatedAt'],
        ['deletedAt', 'ce.deletedAt'],
        ['createdBy', 'ce.createdBy'],
        ['updatedBy', 'ce.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(CATEGORY_EQUIPMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<CategoryEquipment>,
        private readonly _logger: CategoryEquipmentLogger,
    ) {
        super();
    }

    async getCategoryEquipmentByIds(
        ids: number[],
    ): Promise<CategoryEquipment[]> {
        const data = await this._defaultUserRepository.find({
            where: { id: In(ids) },
        });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
    }

    /**
     * Check if Employe Category Equipment Exist
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async exist(
        id?: number | CategoryEquipment,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof CategoryEquipment) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Found CategoryEquipment by column search and is value
     * @param value
     * @param column
     * @param id
     * @param withDeleted
     * @param repo
     * @returns
     */
    public async existByColumn(
        value: any,
        column: string,
        id?: number | CategoryEquipment,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof CategoryEquipment) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'ce',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (CategoryEquipment.isColumnString(column)) {
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
     * Return all Category Equipment
     * @param filter
     * @param sort
     * @param repo
     * @param manager
     * @returns
     */
    public async findAll(
        filter?: CategoryEquipmentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CategoryEquipment[]> {
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
    public async findCategoryEquipmentAndPaginationAll(
        filter: CategoryEquipmentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CategoryEquipmentPaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return all quick access
     * @param filter
     * @param sort
     * @param repo
     * @param manager
     * @returns
     */
    public async findAllCategoryEquipmentsForEquipmentRate(
        filter: CategoryEquipmentFilterEquipmentRateArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CategoryEquipmentPaginationResultInterface> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('ce', manager?.queryRunner)
            .leftJoinAndSelect('ce.mediumSizedCentre', 'msc')
            .leftJoinAndSelect('ce.equipmentRates', 'er')
            .leftJoinAndSelect('er.workUnit', 'er_wu')
            .leftJoinAndSelect('er.entity', 'er_ent');

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
                        _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });

                        // For number
                        // if (filter.search.match(/^[0-9]+((\.|\,)[0-9]+)?$/)) {
                        //   _qb.orWhere(`(${this._cn('costPrice')} = :search)`, {
                        //     search: `%${filter.search}%`,
                        //   });
                        // }
                    }),
                );
            }

            if (filter.title)
                qb.andWhere(`${this._cn('title')} ILIKE :title`, {
                    title: `%${filter.title}%`,
                });

            if (filter.code)
                qb.andWhere(`${this._cn('code')} ILIKE :code`, {
                    code: `%${filter.code}%`,
                });

            if (filter.price)
                qb.andWhere(`${this._cn('price')} = :price`, {
                    price: `%${filter.price}%`,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));

        return qb.getManyAndPaginate(pagination).then((result) => {
            return {
                result: result.result.map((item) => {
                    return {
                        ...item,
                        equipmentRates: item.equipmentRates.filter(
                            (er) => er.entity.id == filter.entity,
                        ),
                    };
                }),
                pagination: result.pagination,
            };
        });
    }

    /**
     * Return one Category Equipment by his id
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async findOne(
        id: number | CategoryEquipment,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CategoryEquipment> {
        if (id instanceof CategoryEquipment) id = id.id;
        return this.findByColumn('id', id, repo, manager);
    }

    /**
     * Return an existing user by his column value
     * @param column
     * @param value
     * @param repo
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CategoryEquipment> {
        const qb = this._initSelect(repo, manager);

        if (CategoryEquipment.isColumnString(column)) {
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
     * Get the last entry
     */
    public async getLastEntry(
        repo?: string,
        manager?: EntityManager,
    ): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const result = await this.getRepo(repo)
                .createQueryBuilder('ce', manager?.queryRunner)
                .withDeleted()
                .select('ce.code', 'code')
                .orderBy('ce.id', 'DESC')
                .limit(1)
                .getRawOne();

            if (result?.code) {
                resolve(parseInt(result.code));
            } else {
                resolve(1);
            }
        });
    }

    /**
     * Create new Category Equipment
     *
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: CategoryEquipmentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CategoryEquipment> {
        return this.useTransaction(async (transaction) => {
            // //retrieve last entry
            // const lastCode = await this.getLastEntry(repo, transaction);

            // //Generate new code
            // const newCode = (lastCode + 1).toString().padStart(4, '0');

            const { mediumSizedCentre, ...rest } = data;

            // Init new Entity Employe Contract Type Entry
            const categoryEquipment = new CategoryEquipment();

            //change value of code with new code
            categoryEquipment.medium_sized_centre_id = mediumSizedCentre?.id;
            categoryEquipment.mediumSizedCentre = mediumSizedCentre;

            // Get uploaded file

            // Set Data
            Object.assign(categoryEquipment, rest);

            // Save hit
            const result = await transaction.save(categoryEquipment);

            if (result) {
                this._logger.create(categoryEquipment);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update new Category Equipment
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: CategoryEquipmentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CategoryEquipment> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldCategoryEquipment = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldCategoryEquipment) {
                // Set old data
                this._logger.setOldData(oldCategoryEquipment);

                // Add new Data
                Object.assign(oldCategoryEquipment, req);

                // Save Data
                const result = await transaction.save(oldCategoryEquipment);

                if (result) {
                    this._logger.update(oldCategoryEquipment);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, manager || repo);
    }

    /**
     * remove an existing entity
     * @param updateEntity
     * @param repo
     * @returns
     */
    public async remove(
        req: CategoryEquipmentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof CategoryEquipment ? id.id : id;
                const categoryEquipment = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (categoryEquipment instanceof CategoryEquipment) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            CategoryEquipment,
                            categoryEquipment.id,
                        );

                        this._logger.delete(CategoryEquipment);
                    } else {
                        await transaction.softDelete(
                            CategoryEquipment,
                            categoryEquipment.id,
                        );

                        this._logger.softDelete(CategoryEquipment);
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
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<CategoryEquipment> {
        return this.getRepo(repo)
            .createQueryBuilder('ce', manager?.queryRunner)
            .leftJoinAndSelect('ce.equipmentParks', 'mp')
            .leftJoinAndSelect('ce.mediumSizedCentre', 'msc');
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<CategoryEquipment>,
        filter?: CategoryEquipmentFilterArgInput,
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
                        _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }

            if (filter.mediumSizedCentreId)
                qb.andWhere(
                    `${this._cn('mediumSizedCentreId')} = :mediumSizedCentreId`,
                    { mediumSizedCentreId: filter.mediumSizedCentreId },
                );

            if (filter.mediumSizedCentreIds?.length)
                qb.andWhere(
                    `${this._cn(
                        'mediumSizedCentreIds',
                    )} IN (:...mediumSizedCentreIds)`,
                    { mediumSizedCentreIds: filter.mediumSizedCentreIds },
                );

            if (filter.title)
                qb.andWhere(`${this._cn('title')} ILIKE :title`, {
                    title: `%${filter.title}%`,
                });

            if (filter.titles?.length)
                qb.andWhere(`${this._cn('titles')} IN (:...titles)`, {
                    titles: filter.titles,
                });

            if (filter.code)
                qb.andWhere(`${this._cn('code')} ILIKE :code`, {
                    code: `%${filter.code}%`,
                });

            if (filter.codes?.length)
                qb.andWhere(`${this._cn('codes')} IN (:...codes)`, {
                    codes: filter.codes,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<CategoryEquipment> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return CategoryEquipmentService.ColumnQueryNames.get(columnName);
    }
}
