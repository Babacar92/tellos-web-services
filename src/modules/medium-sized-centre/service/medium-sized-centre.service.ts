import { Inject, Injectable } from '@nestjs/common';
import { MediumSizedCentreEntity } from 'src/entities/psql/MediumSizedCentreEntity';
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
import { MediumSizedCentreCreateArgInput } from '../dto/args/medium-sized-centre.create.arg.input';
import { MediumSizedCentreFilterArgInput } from '../dto/args/medium-sized-centre.filter.arg.input';
import { MediumSizedCentreRemoveArgInput } from '../dto/args/medium-sized-centre.remove.arg.input';
import { MediumSizedCentreUpdateArgInput } from '../dto/args/medium-sized-centre.update.arg.input';
import { MediumSizedCentrePaginationResultInterface } from '../dto/interfaces/medium-sized-centre.pagination.result.interface';
import { MEDIUM_SIZED_CENTRE_PROVIDERS_NAMES } from '../dto/provider/medium-sized-centre.providers';
import { MediumSizedCentreLogger } from '../logger/medium-sized-centre.logger';

@Injectable()
export class MediumSizedCentreService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'msc.id'],
        ['code', 'msc.code'],
        ['label', 'msc.label'],
        ['active', 'msc.active'],
        ['createdAt', 'msc.createdAt'],
        ['updatedAt', 'msc.updatedAt'],
        ['deletedAt', 'msc.deletedAt'],
        ['createdBy', 'msc.createdBy'],
        ['updatedBy', 'msc.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(MEDIUM_SIZED_CENTRE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<MediumSizedCentreEntity>,
        private readonly _logger: MediumSizedCentreLogger,
    ) {
        super();
    }

    async findCentersByIds(ids: number[]): Promise<MediumSizedCentreEntity[]> {
        const data = await this._defaultUserRepository.find({
            where: { id: In(ids) },
        });

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
        id?: number | MediumSizedCentreEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof MediumSizedCentreEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Found Quick Access by column search and is value
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
        id?: number | MediumSizedCentreEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof MediumSizedCentreEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'msc',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (MediumSizedCentreEntity.isColumnString(column)) {
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
     * @param repo
     * @returns
     */
    public async findAll(
        filter?: MediumSizedCentreFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MediumSizedCentreEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }

    /**
     * Return data with pagination
     * @param sort
     * @param pagination
     * @param repo
     * @param manager
     * @returns
     */
    public async findmediumSizedCentresAndPaginationAll(
        filter: MediumSizedCentreFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MediumSizedCentrePaginationResultInterface> {
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
        id: number | MediumSizedCentreEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MediumSizedCentreEntity> {
        if (id instanceof MediumSizedCentreEntity) id = id.id;
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
    ): Promise<MediumSizedCentreEntity> {
        const qb = this._initSelect(repo, manager);

        if (MediumSizedCentreEntity.isColumnString(column)) {
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
        data: MediumSizedCentreCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MediumSizedCentreEntity> {
        return this.useTransaction(async (transaction) => {
            //  Init new Entity Quick Access
            const mediumSizedCentre = new MediumSizedCentreEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(mediumSizedCentre, rest);

            // Save hit
            const result = await transaction.save(mediumSizedCentre);

            if (result) {
                this._logger.create(mediumSizedCentre);

                return this.findOne(result.id, repo, transaction);
            }
            return;
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
        data: MediumSizedCentreUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MediumSizedCentreEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldMediumSizedCentre = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldMediumSizedCentre) {
                // Set old data
                this._logger.setOldData(oldMediumSizedCentre);

                // Add new Data
                Object.assign(oldMediumSizedCentre, req);

                // Save Data
                const result = await transaction.save(oldMediumSizedCentre);

                if (result) {
                    this._logger.update(oldMediumSizedCentre);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, manager || repo);
    }

    /**
     * Update an existing entity
     * @param updateEntity
     * @param repo
     * @returns
     */
    public async remove(
        req: MediumSizedCentreRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof MediumSizedCentreEntity ? id.id : id;
                const mediumSizedCentre = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (mediumSizedCentre instanceof MediumSizedCentreEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            MediumSizedCentreEntity,
                            mediumSizedCentre.id,
                        );

                        this._logger.delete(mediumSizedCentre);
                    } else {
                        await transaction.softDelete(
                            MediumSizedCentreEntity,
                            mediumSizedCentre.id,
                        );

                        this._logger.softDelete(mediumSizedCentre);
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
    ): SelectQueryBuilder<MediumSizedCentreEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('msc', manager?.queryRunner)
            .leftJoinAndSelect('msc.categoryEquipments', 'ce');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     *
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<MediumSizedCentreEntity>,
        filter?: MediumSizedCentreFilterArgInput,
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
                        _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });

                        _qb.orWhere(`(${this._cn('label')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }

            if (filter.code)
                qb.andWhere(`${this._cn('code')} ILIKE :code`, {
                    code: `%${filter.code}%`,
                });

            if (filter.codes?.length)
                qb.andWhere(`${this._cn('code')} IN (:...codes)`, {
                    codes: filter.codes,
                });

            if (filter.label)
                qb.andWhere(`${this._cn('label')} ILIKE :label`, {
                    label: `%${filter.label}%`,
                });

            if (filter.labels?.length)
                qb.andWhere(`${this._cn('label')} IN (:...labels)`, {
                    labels: filter.labels,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<MediumSizedCentreEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return MediumSizedCentreService.ColumnQueryNames.get(columnName);
    }
}
