import { Inject, Injectable } from '@nestjs/common';
import { BusinessTenderTypeEntity } from 'src/entities/psql/BusinessTenderTypeEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessTenderTypeCreateArgInput } from '../dto/args/business-tender-type.create.arg.input';
import { BusinessTenderTypeFilterArgInput } from '../dto/args/business-tender-type.filter.arg.input';
import { BusinessTenderTypeRemoveArgInput } from '../dto/args/business-tender-type.remove.arg.input';
import { BusinessTenderTypeUpdateArgInput } from '../dto/args/business-tender-type.update.arg.input';
import { BusinessTenderTypePaginationResultInterface } from '../dto/interfaces/business-tender-type.pagination.result.interface';
import { BUSINESS_TENDER_TYPE_PROVIDERS_NAMES } from '../dto/provider/business-tender-type.providers';
import { BusinessTenderTypeLogger } from '../logger/business-tender-type.logger';

@Injectable()
export class BusinessTenderTypeService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'bmt.id'],
        ['title', 'bmt.title'],
        ['active', 'bmt.active'],
        ['createdAt', 'bmt.createdAt'],
        ['updatedAt', 'bmt.updatedAt'],
        ['deletedAt', 'bmt.deletedAt'],
        ['createdBy', 'bmt.createdBy'],
        ['updatedBy', 'bmt.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(BUSINESS_TENDER_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<BusinessTenderTypeEntity>,
        private readonly _logger: BusinessTenderTypeLogger,
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
        id?: number | BusinessTenderTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof BusinessTenderTypeEntity) id = id.id;

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
        id?: number | BusinessTenderTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof BusinessTenderTypeEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('bmt', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (BusinessTenderTypeEntity.isColumnString(column)) {
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
        filter?: BusinessTenderTypeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessTenderTypeEntity[]> {
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
    public async findBusinessTenderTypesAndPaginationAll(
        filter: BusinessTenderTypeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessTenderTypePaginationResultInterface> {
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
        id: number | BusinessTenderTypeEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessTenderTypeEntity> {
        if (id instanceof BusinessTenderTypeEntity) id = id.id;
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
    ): Promise<BusinessTenderTypeEntity> {
        const qb = this._initSelect(repo, manager);

        if (BusinessTenderTypeEntity.isColumnString(column)) {
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
        data: BusinessTenderTypeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessTenderTypeEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const businessTenderType = new BusinessTenderTypeEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(businessTenderType, rest);

            // Save hit
            const result = await transaction.save(businessTenderType);

            if (result) {
                this._logger.create(businessTenderType);

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
        data: BusinessTenderTypeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<BusinessTenderTypeEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldBusinessTenderType = await this.findOne(id, repo, transaction);

            if (oldBusinessTenderType) {
                // Set old data
                this._logger.setOldData(oldBusinessTenderType);

                // Add new Data
                Object.assign(oldBusinessTenderType, req);

                // Save Data
                const result = await transaction.save(oldBusinessTenderType);

                if (result) {
                    this._logger.update(oldBusinessTenderType);

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
        req: BusinessTenderTypeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof BusinessTenderTypeEntity ? id.id : id;
                const businessTenderType = await this.findOne(id, repo, transaction);

                if (businessTenderType instanceof BusinessTenderTypeEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(BusinessTenderTypeEntity, businessTenderType.id);

                        this._logger.delete(businessTenderType);
                    } else {
                        await transaction.softDelete(BusinessTenderTypeEntity, businessTenderType.id);

                        this._logger.softDelete(businessTenderType);
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
    ): SelectQueryBuilder<BusinessTenderTypeEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('bmt', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<BusinessTenderTypeEntity>,
        filter?: BusinessTenderTypeFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.title) qb.andWhere(`${this._cn('title')} ILIKE :title`, { title: `%${filter.title}%` });

            if (filter.titles?.length) qb.andWhere(`${this._cn('title')} IN (:...titles)`, { titles: filter.titles });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<BusinessTenderTypeEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return BusinessTenderTypeService.ColumnQueryNames.get(columnName);
    }

}
