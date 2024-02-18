import { Inject, Injectable } from '@nestjs/common';
import { RegulationCodeEntity } from 'src/entities/psql/RegulationCodeEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { RegulationCodeCreateArgInput } from '../dto/args/regulation-code.create.arg.input';
import { RegulationCodeFilterArgInput } from '../dto/args/regulation-code.filter.arg.input';
import { RegulationCodeRemoveArgInput } from '../dto/args/regulation-code.remove.arg.input';
import { RegulationCodeUpdateArgInput } from '../dto/args/regulation-code.update.arg.input';
import { RegulationCodePaginationResultInterface } from '../dto/interfaces/regulation-code.pagination.result.interface';
import { REGULATION_CODE_PROVIDERS_NAMES } from '../dto/provider/regulation-code.providers';
import { RegulationCodeLogger } from '../logger/regulation-code.logger';

@Injectable()
export class RegulationCodeService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'rc.id'],
        ['customer', 'c.id'],
        ['customerId', 'c.id'],
        ['code', 'rc.code'],
        ['title', 'rc.title'],
        ['immediateDays', 'rc.immediateDays'],
        ['specificity', 'rc.specificity'],
        ['paymentDays', 'rc.paymentDays'],
        ['additionnalDays', 'rc.additionnalDays'],
        ['title', 'rc.title'],
        ['active', 'rc.active'],
        ['createdAt', 'rc.createdAt'],
        ['updatedAt', 'rc.updatedAt'],
        ['deletedAt', 'rc.deletedAt'],
        ['createdBy', 'rc.createdBy'],
        ['updatedBy', 'rc.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(REGULATION_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<RegulationCodeEntity>,
        private readonly _logger: RegulationCodeLogger,
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
        id?: number | RegulationCodeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof RegulationCodeEntity) id = id.id;

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
        id?: number | RegulationCodeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof RegulationCodeEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('rc', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (RegulationCodeEntity.isColumnString(column)) {
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
        filter?: RegulationCodeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<RegulationCodeEntity[]> {
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
    public async findRegulationCodesAndPaginationAll(
        filter: RegulationCodeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<RegulationCodePaginationResultInterface> {
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
        id: number | RegulationCodeEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<RegulationCodeEntity> {
        if (id instanceof RegulationCodeEntity) id = id.id;
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
    ): Promise<RegulationCodeEntity> {
        const qb = this._initSelect(repo, manager);

        if (RegulationCodeEntity.isColumnString(column)) {
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
        data: RegulationCodeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<RegulationCodeEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const regulationCode = new RegulationCodeEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(regulationCode, rest);

            // Save hit
            const result = await transaction.save(regulationCode);

            if (result) {
                this._logger.create(regulationCode);

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
        data: RegulationCodeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<RegulationCodeEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldRegulationCode = await this.findOne(id, repo, transaction);

            if (oldRegulationCode) {
                // Set old data
                this._logger.setOldData(oldRegulationCode);

                // Add new Data
                Object.assign(oldRegulationCode, req);

                // Save Data
                const result = await transaction.save(oldRegulationCode);

                if (result) {
                    this._logger.update(oldRegulationCode);

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
        req: RegulationCodeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof RegulationCodeEntity ? id.id : id;
                const regulationCode = await this.findOne(id, repo, transaction);

                if (regulationCode instanceof RegulationCodeEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(RegulationCodeEntity, regulationCode.id);

                        this._logger.delete(regulationCode);
                    } else {
                        await transaction.softDelete(RegulationCodeEntity, regulationCode.id);

                        this._logger.softDelete(regulationCode);
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
    ): SelectQueryBuilder<RegulationCodeEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('rc', manager?.queryRunner)
            .leftJoinAndSelect('rc.customers', 'c');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<RegulationCodeEntity>,
        filter?: RegulationCodeFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.title) qb.andWhere(`${this._cn('title')} ILIKE :title`, { title: `%${filter.title}%` });

            if (filter.titles?.length) qb.andWhere(`${this._cn('title')} IN (:...titles)`, { titles: filter.titles });

            if (filter.code) qb.andWhere(`${this._cn('code')} ILIKE :code`, { code: `%${filter.code}%` });

            if (filter.codes?.length) qb.andWhere(`${this._cn('code')} IN (:...codes)`, { codes: filter.codes });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<RegulationCodeEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return RegulationCodeService.ColumnQueryNames.get(columnName);
    }

}
