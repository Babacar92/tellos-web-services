import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { QuickAccessEntity } from '../../../entities/psql/QuickAccessEntity';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from '../../../libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from '../../../libs/services/abstract.repository.service';
import { QuickAccessCreateArgInput } from '../dto/args/quick-access.create.arg.input';
import { QuickAccessFilterArgInput } from '../dto/args/quick-access.filter.arg.input';
import { QuickAccessRemoveArgInput } from '../dto/args/quick-access.remove.arg.input';
import { QuickAccessUpdateArgInput } from '../dto/args/quick-access.update.arg.input';
import { QuickAccessPaginationResultInterface } from '../dto/interfaces/quick-access.pagination.result.interface';
import { QUICK_ACCESS_PROVIDERS_NAMES } from '../dto/provider/quick-access.providers';
import { QuickAccessLogger } from '../logger/quick-access.logger';

@Injectable()
export class QuickAccessService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'qa.id'],
        ['label', 'qa.label'],
        ['link', 'qa.link'],
        ['color', 'qa.color'],
        ['active', 'qa.active'],
        ['createdAt', 'qa.createdAt'],
        ['updatedAt', 'qa.updatedAt'],
        ['deletedAt', 'qa.deletedAt'],
        ['createdBy', 'qa.createdBy'],
        ['updatedBy', 'qa.updatedBy'],
        ['user', 'u.id'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(QUICK_ACCESS_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<QuickAccessEntity>,
        private readonly _logger: QuickAccessLogger,
    ) {
        super();
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
        id?: number | QuickAccessEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof QuickAccessEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
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
        id?: number | QuickAccessEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof QuickAccessEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('qa', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (QuickAccessEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
            }

            if (id > 0 && column !== "id") qb.andWhere(`${this._cn('id')} != :column_id`, { column_id: id });

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
        filter: QuickAccessFilterArgInput,
        sort: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QuickAccessEntity[]> {
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
    public async findQuickAccessAndPaginationAll(
        filter: QuickAccessFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QuickAccessPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

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
        id: number | QuickAccessEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QuickAccessEntity> {
        if (id instanceof QuickAccessEntity) id = id.id;
        return this.findByColumn("id", id, repo, manager);
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
    ): Promise<QuickAccessEntity> {
        const qb = this._initSelect(repo, manager);

        if (QuickAccessEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
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
        data: QuickAccessCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QuickAccessEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const quickAccess = new QuickAccessEntity();

            // Set Data
            Object.assign(quickAccess, data);

            // Save hit
            const result = await transaction.save(quickAccess);

            if (result) {
                this._logger.create(quickAccess);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Quick Access
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: QuickAccessUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QuickAccessEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldQuickAccess = await this.findOne(id, repo, transaction);


            if (oldQuickAccess) {
                // Set old data
                this._logger.setOldData(oldQuickAccess);

                // Add new Data
                Object.assign(oldQuickAccess, req);

                // Save Data
                const result = await transaction.save(oldQuickAccess);

                if (result) {
                    this._logger.update(oldQuickAccess);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing quickaccess
     * @param updateQuickAccess 
     * @param repo 
     * @returns
     */
    public async remove(
        req: QuickAccessRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof QuickAccessEntity ? id.id : id;
                const quickaccess = await this.findOne(id, repo, transaction);

                if (quickaccess instanceof QuickAccessEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(QuickAccessEntity, quickaccess.id);

                        this._logger.delete(quickaccess);
                    } else {
                        await transaction.softDelete(QuickAccessEntity, quickaccess.id);

                        this._logger.softDelete(quickaccess);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, (manager || repo));
    }

    /**
     * Init Select Query Builder
     * @param repo 
     * @returns 
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<QuickAccessEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('qa', manager?.queryRunner)
            .leftJoinAndSelect('qa.employee', 'e');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<QuickAccessEntity>,
        filter?: QuickAccessFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`${this._cn('label')} ILIKE :search`, { search: `%${filter.search}%` });

                    _qb.orWhere(`${this._cn('link')} ILIKE :search`, { search: `%${filter.search}%` });

                    _qb.orWhere(`${this._cn('color')} ILIKE :search`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.label) qb.andWhere(`${this._cn('label')} ILIKE :label`, { label: `%${filter.label}%` });

            if (filter.labels?.length) qb.andWhere(`${this._cn('label')} IN (:...labels)`, { labels: filter.labels });

            if (filter.link) qb.andWhere(`${this._cn('link')} ILIKE :link`, { link: `%${filter.link}%` });

            if (filter.links?.length) qb.andWhere(`${this._cn('link')} IN (:...links)`, { links: filter.links });

            if (filter.color) qb.andWhere(`${this._cn('color')} ILIKE :color`, { color: `%${filter.color}%` });

            if (filter.colors?.length) qb.andWhere(`${this._cn('color')} IN (:...colors)`, { colors: filter.colors });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<QuickAccessEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return QuickAccessService.ColumnQueryNames.get(columnName);
    }

}
