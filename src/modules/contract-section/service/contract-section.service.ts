import { Inject, Injectable } from '@nestjs/common';
import { ContractSectionEntity } from 'src/entities/psql/ContractSectionEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ContractSectionCreateArgInput } from '../dto/args/contract-section.create.arg.input';
import { ContractSectionFilterArgInput } from '../dto/args/contract-section.filter.arg.input';
import { ContractSectionRemoveArgInput } from '../dto/args/contract-section.remove.arg.input';
import { ContractSectionUpdateArgInput } from '../dto/args/contract-section.update.arg.input';
import { ContractSectionPaginationResultInterface } from '../dto/interfaces/contract-section.pagination.result.interface';
import { CONTRACT_SECTION_PROVIDERS_NAMES } from '../dto/provider/contract-section.providers';
import { ContractSectionLogger } from '../logger/contract-section.logger';

@Injectable()
export class ContractSectionService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 's.id'],
        ['title', 's.title'],
        ['active', 's.active'],
        ['createdAt', 's.createdAt'],
        ['updatedAt', 's.updatedAt'],
        ['deletedAt', 's.deletedAt'],
        ['createdBy', 's.createdBy'],
        ['updatedBy', 's.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CONTRACT_SECTION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ContractSectionEntity>,
        private readonly _logger: ContractSectionLogger,
    ) {
        super();
    }

    /**
     * Check if Employe Contract Section  Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | ContractSectionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ContractSectionEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found Employe Contract Section by column search and is value
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
        id?: number | ContractSectionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof ContractSectionEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('s', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ContractSectionEntity.isColumnString(column)) {
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
     * Return all Employe Contract Section 
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: ContractSectionFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractSectionEntity[]> {
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
    public async findEmployeContractSectionAndPaginationAll(
        filter: ContractSectionFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractSectionPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Employe Contract Section by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | ContractSectionEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractSectionEntity> {
        if (id instanceof ContractSectionEntity) id = id.id;
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
    ): Promise<ContractSectionEntity> {
        const qb = this._initSelect(repo, manager);

        if (ContractSectionEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Employe Contract Section 
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: ContractSectionCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractSectionEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Employe Contract Section 
            const contractSection = new ContractSectionEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(contractSection, rest);

            // Save hit
            const result = await transaction.save(contractSection);

            if (result) {
                this._logger.create(contractSection);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Employe Contract Section 
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: ContractSectionUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractSectionEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldContractSection = await this.findOne(id, repo, transaction);

            if (oldContractSection) {
                // Set old data
                this._logger.setOldData(oldContractSection);

                // Add new Data
                Object.assign(oldContractSection, req);

                // Save Data
                const result = await transaction.save(oldContractSection);

                if (result) {
                    this._logger.update(oldContractSection);

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
        req: ContractSectionRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                const contractSection = await this.findOne(id, repo, transaction);

                if (contractSection instanceof ContractSectionEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ContractSectionEntity, contractSection.id);

                        this._logger.delete(contractSection);
                    } else {
                        await transaction.softDelete(ContractSectionEntity, contractSection.id);

                        this._logger.softDelete(contractSection);
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
    ): SelectQueryBuilder<ContractSectionEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('s', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ContractSectionEntity>,
        filter?: ContractSectionFilterArgInput,
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

    public getRepo(repo?: string): Repository<ContractSectionEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ContractSectionService.ColumnQueryNames.get(columnName);
    }

}
