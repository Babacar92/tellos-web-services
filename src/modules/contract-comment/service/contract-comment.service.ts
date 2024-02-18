import { Inject, Injectable } from '@nestjs/common';
import { ContractCommentEntity } from 'src/entities/psql/ContractCommentEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ContractCommentCreateArgInput } from '../dto/args/contract-comment.create.arg.input';
import { ContractCommentFilterArgInput } from '../dto/args/contract-comment.filter.arg.input';
import { ContractCommentRemoveArgInput } from '../dto/args/contract-comment.remove.arg.input';
import { ContractCommentUpdateArgInput } from '../dto/args/contract-comment.update.arg.input';
import { ContractCommentPaginationResultInterface } from '../dto/interfaces/contract-comment.pagination.result.interface';
import { CONTRACT_COMMENT_PROVIDERS_NAMES } from '../dto/provider/contract-comment.providers';
import { ContractCommentLogger } from '../logger/contract-comment.logger';

@Injectable()
export class ContractCommentService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'cc.id'],
        ['comment', 'cc.comment'],
        ['employeeId', 'emp.id'],
        ['contractPreviewId', 'cp.id'],
        ['contractPreview', 'cp.id'],
        ['contractPreview.text', 'cp.text'],
        ['contractPreview.status', 'cp.status'],
        ['contractPreview.typeContract', 'cp.typeContract'],
        ['active', 'cc.active'],
        ['contractId', 'cp.id'],
        ['createdAt', 'cc.createdAt'],
        ['updatedAt', 'cc.updatedAt'],
        ['deletedAt', 'cc.deletedAt'],
        ['createdBy', 'cc.createdBy'],
        ['updatedBy', 'cc.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CONTRACT_COMMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ContractCommentEntity>,
        private readonly _logger: ContractCommentLogger,
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
        id?: number | ContractCommentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ContractCommentEntity) id = id.id;

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
        id?: number | ContractCommentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof ContractCommentEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('cc', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ContractCommentEntity.isColumnString(column)) {
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
        filter?: ContractCommentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractCommentEntity[]> {
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
    public async findContractCommentAndPaginationAll(
        filter: ContractCommentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractCommentPaginationResultInterface> {
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
        id: number | ContractCommentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractCommentEntity> {
        if (id instanceof ContractCommentEntity) id = id.id;
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
    ): Promise<ContractCommentEntity> {
        const qb = this._initSelect(repo, manager);

        if (ContractCommentEntity.isColumnString(column)) {
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
        data: ContractCommentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractCommentEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const contractComment = new ContractCommentEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(contractComment, rest);

            // Save hit
            const result = await transaction.save(contractComment);

            if (result) {
                this._logger.create(contractComment);

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
        data: ContractCommentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractCommentEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldContractComment = await this.findOne(id, repo, transaction);

            if (oldContractComment) {
                // Set old data
                this._logger.setOldData(oldContractComment);

                // Add new Data
                Object.assign(oldContractComment, req);

                // Save Data
                const result = await transaction.save(oldContractComment);

                if (result) {
                    this._logger.update(oldContractComment);

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
        req: ContractCommentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ContractCommentEntity ? id.id : id;
                const contractComment = await this.findOne(id, repo, transaction);

                if (contractComment instanceof ContractCommentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ContractCommentEntity, contractComment.id);

                        this._logger.delete(contractComment);
                    } else {
                        await transaction.softDelete(ContractCommentEntity, contractComment.id);

                        this._logger.softDelete(contractComment);
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
    ): SelectQueryBuilder<ContractCommentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('cc', manager?.queryRunner)
            .leftJoinAndSelect('cc.employee', 'emp')
            .leftJoinAndSelect('emp.login', 'login')
            .leftJoinAndSelect('emp.picture', 'picture')
            .leftJoinAndSelect('cc.contract', 'cp');


        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ContractCommentEntity>,
        filter?: ContractCommentFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('name')} ILIKE :search)`, { search: `%${filter.search}%` });

                }));

            }

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeIds')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });

            if (filter.contractId) qb.andWhere(`${this._cn('contractId')} = :contractId`, { contractId: filter.contractId });

            if (filter.contractIds?.length) qb.andWhere(`${this._cn('contractId')} IN (:...contractIds)`, { contractIds: filter.contractIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<ContractCommentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ContractCommentService.ColumnQueryNames.get(columnName);
    }

}
