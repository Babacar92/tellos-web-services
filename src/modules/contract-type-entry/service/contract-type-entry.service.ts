import { Inject, Injectable } from '@nestjs/common';
import { ContractTypeEntryEntity } from 'src/entities/psql/ContractTypeEntryEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ContractTypeEntryCreateArgInput } from '../dto/args/contract-type-entry.create.arg.input';
import { ContractTypeEntryFilterArgInput } from '../dto/args/contract-type-entry.filter.arg.input';
import { ContractTypeEntryRemoveArgInput } from '../dto/args/contract-type-entry.remove.arg.input';
import { ContractTypeEntryUpdateArgInput } from '../dto/args/contract-type-entry.update.arg.input';
import { ContractTypeEntryPaginationResultInterface } from '../dto/interfaces/contract-type-entry.pagination.result.interface';
import { CONTRACT_TYPE_ENTRY_PROVIDERS_NAMES } from '../dto/provider/contract-type-entry.providers';
import { ContractTypeEntryLogger } from '../logger/contract-type-entry.logger';

@Injectable()
export class ContractTypeEntryService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'te.id'],
        ['title', 'te.title'],
        ['active', 'te.active'],
        ['createdAt', 'te.createdAt'],
        ['updatedAt', 'te.updatedAt'],
        ['deletedAt', 'te.deletedAt'],
        ['createdBy', 'te.createdBy'],
        ['updatedBy', 'te.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CONTRACT_TYPE_ENTRY_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ContractTypeEntryEntity>,
        private readonly _logger: ContractTypeEntryLogger,
    ) {
        super();
    }

    /**
     * Check if Employe Contract Type Entry Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | ContractTypeEntryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ContractTypeEntryEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found Employe Contract Type Entry by column search and is value
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
        id?: number | ContractTypeEntryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof ContractTypeEntryEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('te', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ContractTypeEntryEntity.isColumnString(column)) {
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
     * Return all Employe Contract Type Entry
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: ContractTypeEntryFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypeEntryEntity[]> {
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
    public async findEmployeContractTypeEntryAndPaginationAll(
        filter: ContractTypeEntryFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypeEntryPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Employe Contract Type Entry by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | ContractTypeEntryEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypeEntryEntity> {
        if (id instanceof ContractTypeEntryEntity) id = id.id;
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
    ): Promise<ContractTypeEntryEntity> {
        const qb = this._initSelect(repo, manager);

        if (ContractTypeEntryEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Employe Contract Type Entry
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: ContractTypeEntryCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypeEntryEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Employe Contract Type Entry
            const contractTypeEntry = new ContractTypeEntryEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(contractTypeEntry, rest);

            // Save hit
            const result = await transaction.save(contractTypeEntry);

            if (result) {
                this._logger.create(contractTypeEntry);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Employe Contract Type Entry
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: ContractTypeEntryUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypeEntryEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldContractTypeEntry = await this.findOne(id, repo, transaction);

            if (oldContractTypeEntry) {
                // Set old data
                this._logger.setOldData(oldContractTypeEntry);

                // Add new Data
                Object.assign(oldContractTypeEntry, req);

                // Save Data
                const result = await transaction.save(oldContractTypeEntry);

                if (result) {
                    this._logger.update(oldContractTypeEntry);

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
        req: ContractTypeEntryRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ContractTypeEntryEntity ? id.id : id;
                const contractTypeEntry = await this.findOne(id, repo, transaction);

                if (contractTypeEntry instanceof ContractTypeEntryEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ContractTypeEntryEntity, contractTypeEntry.id);

                        this._logger.delete(contractTypeEntry);
                    } else {
                        await transaction.softDelete(ContractTypeEntryEntity, contractTypeEntry.id);

                        this._logger.softDelete(contractTypeEntry);
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
    ): SelectQueryBuilder<ContractTypeEntryEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('te', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ContractTypeEntryEntity>,
        filter?: ContractTypeEntryFilterArgInput,
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

    public getRepo(repo?: string): Repository<ContractTypeEntryEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ContractTypeEntryService.ColumnQueryNames.get(columnName);
    }

}
