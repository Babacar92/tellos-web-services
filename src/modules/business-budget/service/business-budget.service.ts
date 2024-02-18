import { Inject, Injectable } from '@nestjs/common';
import { BusinessBudgetEntity } from 'src/entities/psql/BusinessBudgetEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessBudgetCreateArgInput } from '../dto/args/business-budget.create.arg.input';
import { BusinessBudgetFilterArgInput } from '../dto/args/business-budget.filter.arg.input';
import { BusinessBudgetRemoveArgInput } from '../dto/args/business-budget.remove.arg.input';
import { BusinessBudgetUpdateArgInput } from '../dto/args/business-budget.update.arg.input';
import { BusinessBudgetPaginationResultInterface } from '../dto/interfaces/business-budget.pagination.result.interface';
import { BUSINESS_BUDGET_PROVIDERS_NAMES } from '../dto/provider/business-budget.providers';
import { BusinessBatchStatusLogger } from '../logger/business-budget.logger';

@Injectable()
export class BusinessBudgetService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'bb.id'],
        ['entity', 'e.id'],
        ['entityId', 'e.id'],
        ['business', 'b.id'],
        ['businessId', 'b.id'],
        ['work', 'bb.work'],
        ['htPrice', 'bb.htPrice'],
        ['margin', 'bb.margin'],
        ['htMargin', 'bb.htMargin'],
        ['htTotal', 'bb.htTotal'],
        ['active', 'bb.active'],
        ['createdAt', 'bb.createdAt'],
        ['updatedAt', 'bb.updatedAt'],
        ['deletedAt', 'bb.deletedAt'],
        ['createdBy', 'bb.createdBy'],
        ['updatedBy', 'bb.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(BUSINESS_BUDGET_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<BusinessBudgetEntity>,
        private readonly _logger: BusinessBatchStatusLogger,
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
        id?: number | BusinessBudgetEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof BusinessBudgetEntity) id = id.id;

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
        id?: number | BusinessBudgetEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof BusinessBudgetEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('bb', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (BusinessBudgetEntity.isColumnString(column)) {
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
        filter?: BusinessBudgetFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBudgetEntity[]> {
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
    public async findBusinessBudgetsAndPaginationAll(
        filter: BusinessBudgetFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBudgetPaginationResultInterface> {
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
        id: number | BusinessBudgetEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBudgetEntity> {
        if (id instanceof BusinessBudgetEntity) id = id.id;
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
    ): Promise<BusinessBudgetEntity> {
        const qb = this._initSelect(repo, manager);

        if (BusinessBudgetEntity.isColumnString(column)) {
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
        data: BusinessBudgetCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBudgetEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const businessBudget = new BusinessBudgetEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(businessBudget, rest);

            // Save hit
            const result = await transaction.save(businessBudget);

            if (result) {
                this._logger.create(businessBudget);

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
        data: BusinessBudgetUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessBudgetEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldBusinessBudget = await this.findOne(id, repo, transaction);

            if (oldBusinessBudget) {
                // Set old data
                this._logger.setOldData(oldBusinessBudget);

                // Add new Data
                Object.assign(oldBusinessBudget, req);

                // Save Data
                const result = await transaction.save(oldBusinessBudget);

                if (result) {
                    this._logger.update(oldBusinessBudget);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing entity
     * @param updateEntity 
     * @param repo 
     * @returns
     */
    public async remove(
        req: BusinessBudgetRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof BusinessBudgetEntity ? id.id : id;
                const businessBudget = await this.findOne(id, repo, transaction);

                if (businessBudget instanceof BusinessBudgetEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(BusinessBudgetEntity, businessBudget.id);

                        this._logger.delete(businessBudget);
                    } else {
                        await transaction.softDelete(BusinessBudgetEntity, businessBudget.id);

                        this._logger.softDelete(businessBudget);
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
    ): SelectQueryBuilder<BusinessBudgetEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('bb', manager?.queryRunner)
            .leftJoinAndSelect('bb.business', 'b')
            .leftJoinAndSelect('bb.entity', 'e')
            ;

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<BusinessBudgetEntity>,
        filter?: BusinessBudgetFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('work')} ILIKE :search)`, { search: `%${filter.search}%` });

                    // For number
                    if (filter.search.match(/^[0-9]+((\.|\,)[0-9]+)?$/)) {
                        _qb.orWhere(`${this._cn('htPrice')} = :search`, { search: filter.search });
                        _qb.orWhere(`${this._cn('margin')} = :search`, { search: filter.search });
                        _qb.orWhere(`${this._cn('htMargin')} = :search`, { search: filter.search });
                        _qb.orWhere(`${this._cn('htTotal')} = :search`, { search: filter.search });
                    }
                }));
            }

            if (filter.business) qb.andWhere(`${this._cn('business')} = :business`, { business: filter.business });

            if (filter.businesses?.length) qb.andWhere(`${this._cn('business')} IN (:...businesses)`, { businesses: filter.businesses });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<BusinessBudgetEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return BusinessBudgetService.ColumnQueryNames.get(columnName);
    }

}
