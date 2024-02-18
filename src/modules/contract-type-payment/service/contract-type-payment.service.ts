import { Inject, Injectable } from '@nestjs/common';
import { ContractTypePaymentEntity } from 'src/entities/psql/ContractTypePaymentEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ContractTypePaymentCreateArgInput } from '../dto/args/contract-type-payment.create.arg.input';
import { ContractTypePaymentFilterArgInput } from '../dto/args/contract-type-payment.filter.arg.input';
import { ContractTypePaymentRemoveArgInput } from '../dto/args/contract-type-payment.remove.arg.input';
import { ContractTypePaymentUpdateArgInput } from '../dto/args/contract-type-payment.update.arg.input';
import { ContractTypePaymentPaginationResultInterface } from '../dto/interfaces/contract-type-payment.pagination.result.interface';
import { CONTRACT_TYPE_PAYMENT_PROVIDERS_NAMES } from '../dto/provider/contract-type-payment.providers';
import { ContractTypePaymentLogger } from '../logger/contract-type-payment.logger';

@Injectable()
export class ContractTypePaymentService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'tp.id'],
        ['title', 'tp.title'],
        ['active', 'tp.active'],
        ['createdAt', 'tp.createdAt'],
        ['updatedAt', 'tp.updatedAt'],
        ['deletedAt', 'tp.deletedAt'],
        ['createdBy', 'tp.createdBy'],
        ['updatedBy', 'tp.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CONTRACT_TYPE_PAYMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ContractTypePaymentEntity>,
        private readonly _logger: ContractTypePaymentLogger,
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
        id?: number | ContractTypePaymentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ContractTypePaymentEntity) id = id.id;

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
        id?: number | ContractTypePaymentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof ContractTypePaymentEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('tp', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ContractTypePaymentEntity.isColumnString(column)) {
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
        filter?: ContractTypePaymentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypePaymentEntity[]> {
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
    public async findEmployeContractTypePaymentAndPaginationAll(
        filter: ContractTypePaymentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypePaymentPaginationResultInterface> {
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
        id: number | ContractTypePaymentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypePaymentEntity> {
        if (id instanceof ContractTypePaymentEntity) id = id.id;
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
    ): Promise<ContractTypePaymentEntity> {
        const qb = this._initSelect(repo, manager);

        if (ContractTypePaymentEntity.isColumnString(column)) {
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
        data: ContractTypePaymentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypePaymentEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Employe Contract Type Entry
            const contractTypePayment = new ContractTypePaymentEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(contractTypePayment, rest);

            // Save hit
            const result = await transaction.save(contractTypePayment);

            if (result) {
                this._logger.create(contractTypePayment);

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
        data: ContractTypePaymentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractTypePaymentEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldContractTypePayment = await this.findOne(id, repo, transaction);

            if (oldContractTypePayment) {
                // Set old data
                this._logger.setOldData(oldContractTypePayment);

                // Add new Data
                Object.assign(oldContractTypePayment, req);

                // Save Data
                const result = await transaction.save(oldContractTypePayment);

                if (result) {
                    this._logger.update(oldContractTypePayment);

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
        req: ContractTypePaymentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ContractTypePaymentEntity ? id.id : id;
                const contractTypePayment = await this.findOne(id, repo, transaction);

                if (contractTypePayment instanceof ContractTypePaymentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ContractTypePaymentEntity, contractTypePayment.id);

                        this._logger.delete(contractTypePayment);
                    } else {
                        await transaction.softDelete(ContractTypePaymentEntity, contractTypePayment.id);

                        this._logger.softDelete(contractTypePayment);
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
    ): SelectQueryBuilder<ContractTypePaymentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('tp', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ContractTypePaymentEntity>,
        filter?: ContractTypePaymentFilterArgInput,
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

    public getRepo(repo?: string): Repository<ContractTypePaymentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ContractTypePaymentService.ColumnQueryNames.get(columnName);
    }

}
