import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ContractApprenticeCreateArgInput } from '../dto/args/contract-apprentice.create.arg.input';
import { ContractApprenticeFilterArgInput } from '../dto/args/contract-apprentice.filter.arg.input';
import { ContractApprenticeRemoveArgInput } from '../dto/args/contract-apprentice.remove.arg.input';
import { ContractApprenticeUpdateArgInput } from '../dto/args/contract-apprentice.update.arg.input';
import { ContractApprenticePaginationResultInterface } from '../dto/interfaces/contract-apprentice.pagination.result.interface';
import { CONTRACT_APPRENTICE_PROVIDERS_NAMES } from '../dto/provider/contract-apprentice.providers';
import { ContractApprenticeEntity } from 'src/entities/psql/ContractApprenticeEntity';
import { ContractApprenticeLogger } from '../logger/contract-apprentice.logger';

@Injectable()
export class ContractApprenticeService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'ap.id'],
        ['title', 'ap.title'],
        ['active', 'ap.active'],
        ['createdAt', 'ap.createdAt'],
        ['updatedAt', 'ap.updatedAt'],
        ['deletedAt', 'ap.deletedAt'],
        ['createdBy', 'ap.createdBy'],
        ['updatedBy', 'ap.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CONTRACT_APPRENTICE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ContractApprenticeEntity>,
        private readonly _logger: ContractApprenticeLogger,
    ) {
        super();
    }

    /**
     * Check if Employe Contract Apprentice Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | ContractApprenticeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ContractApprenticeEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found Employe Contract Apprentice by column search and is value
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
        id?: number | ContractApprenticeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof ContractApprenticeEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('ap', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ContractApprenticeEntity.isColumnString(column)) {
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
     * Return all Employe Contract Apprentice
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: ContractApprenticeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractApprenticeEntity[]> {
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
    public async findEmployeContractApprenticeAndPaginationAll(
        filter: ContractApprenticeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractApprenticePaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Employe Contract Apprentice by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | ContractApprenticeEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractApprenticeEntity> {
        if (id instanceof ContractApprenticeEntity) id = id.id;
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
    ): Promise<ContractApprenticeEntity> {
        const qb = this._initSelect(repo, manager);

        if (ContractApprenticeEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Employe Contract Apprentice
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: ContractApprenticeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractApprenticeEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Employe Contract Apprentice
            const contractApprentice = new ContractApprenticeEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(contractApprentice, rest);

            // Save hit
            const result = await transaction.save(contractApprentice);

            if (result) {
                this._logger.create(contractApprentice);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Employe Contract Apprentice
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: ContractApprenticeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractApprenticeEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldContractApprentice = await this.findOne(id, repo, transaction);

            if (oldContractApprentice) {
                // Set old data
                this._logger.setOldData(oldContractApprentice);

                // Add new Data
                Object.assign(oldContractApprentice, req);

                // Save Data
                const result = await transaction.save(oldContractApprentice);

                if (result) {
                    this._logger.update(oldContractApprentice);

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
        req: ContractApprenticeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ContractApprenticeEntity ? id.id : id;
                const contractApprentice = await this.findOne(id, repo, transaction);

                if (contractApprentice instanceof ContractApprenticeEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ContractApprenticeEntity, contractApprentice.id);

                        this._logger.delete(contractApprentice);
                    } else {
                        await transaction.softDelete(ContractApprenticeEntity, contractApprentice.id);

                        this._logger.softDelete(contractApprentice);
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
    ): SelectQueryBuilder<ContractApprenticeEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('ap', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ContractApprenticeEntity>,
        filter?: ContractApprenticeFilterArgInput,
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

    public getRepo(repo?: string): Repository<ContractApprenticeEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ContractApprenticeService.ColumnQueryNames.get(columnName);
    }

}
