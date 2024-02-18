import { Inject, Injectable } from '@nestjs/common';
import { ContractInfoEntity } from 'src/entities/psql/ContractInfoEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ContractCreateArgInput } from '../dto/args/contract-info.create.arg.input';
import { ContractFilterArgInput } from '../dto/args/contract-info.filter.arg.input';
import { ContractRemoveArgInput } from '../dto/args/contract-info.remove.arg.input';
import { ContractUpdateArgInput } from '../dto/args/contract-info.update.arg.input';
import { ContractPaginationResultInterface } from '../dto/interfaces/contract-info.pagination.result.interface';
import { CONTRACT_PROVIDERS_NAMES } from '../dto/provider/contract-info.providers';
import { EmployeeService } from 'src/modules/employee/service/employee.service';
import { ContractInfoLogger } from '../logger/contract-info.logger';

@Injectable()
export class ContractInfoService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'ec.id'],
        ['entryDate', 'ec.entryDate'],
        ['seniorityDate', 'ec.seniorityDate'],
        ['sagePayCode', 'ec.sagePayCode'],
        ['endTrialPeriod', 'ec.endTrialPeriod'],
        ['renewal', 'ec.renewal'],
        ['endRenewal', 'ec.endRenewal'],
        ['typeContract', 'ec.typeContract'],
        ['endContractCdd', 'ec.endContractCdd'],
        ['amendmentCdd', 'ec.amendmentCdd'],
        ['leavingRaison', 'ec.leavingRaison'],
        ['job', 'ec.job'],
        ['category', 'ec.category'],
        ['code', 'ec.code'],
        ['position', 'ec.position'],
        ['coefficient', 'ec.coefficient'],
        ['largeRateDep', 'ec.largeRateDep'],
        ['ageCategory', 'ec.ageCategory'],
        ['jobDescriptionId', 'jd.id'],
        ['jobDescription', 'jd.id'],
        ['jobDescription.title', 'jd.title'],
        ['employee', 'emp.id'],
        ['typeEntryId', 'te.id'],
        ['typeEntry', 'te.id'],
        ['typeEntry.title', 'te.title'],
        ['typePaymentId', 'tp.id'],
        ['typePayment', 'tp.id'],
        ['typePayment.title', 'tp.title'],
        ['levelId', 'l.id'],
        ['level', 'l.id'],
        ['level.title', 'l.title'],
        ['sectionId', 's.id'],
        ['section', 's.id'],
        ['section.title', 's.title'],
        ['apprenticeId', 'ap.id'],
        ['apprentice', 'ap.id'],
        ['apprentice.title', 'ap.title'],
        ['active', 'ec.active'],
        ['createdAt', 'ec.createdAt'],
        ['updatedAt', 'ec.updatedAt'],
        ['deletedAt', 'ec.deletedAt'],
        ['createdBy', 'ec.createdBy'],
        ['updatedBy', 'ec.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CONTRACT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ContractInfoEntity>,
        private readonly _logger: ContractInfoLogger,
        private readonly _employeeService: EmployeeService,
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
        id?: number | ContractInfoEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ContractInfoEntity) id = id.id;

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
        id?: number | ContractInfoEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof ContractInfoEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('ec', manager?.queryRunner)

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ContractInfoEntity.isColumnString(column)) {
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
        filter?: ContractFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractInfoEntity[]> {
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
    public async findContractAndPaginationAll(
        filter: ContractFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractPaginationResultInterface> {
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
        id: number | ContractInfoEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractInfoEntity> {
        if (id instanceof ContractInfoEntity) id = id.id;
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
    ): Promise<ContractInfoEntity> {
        const qb = this._initSelect(repo, manager);

        if (ContractInfoEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Employee Contract
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: ContractCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractInfoEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const contract = new ContractInfoEntity();

            // Get rest
            const { ...rest } = data;

            // Set Data
            Object.assign(contract, rest);

            // Save it
            const result = await transaction.save(contract);

            if (result) {

                result.employee = await this._employeeService.update({
                    id: result.employee.id,
                    contractInfo: result,
                }, null, transaction);

                this._logger.create(contract);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Employee Contract
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: ContractUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractInfoEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldContract = await this.findOne(id, repo, transaction);

            if (oldContract) {
                // Set old data
                this._logger.setOldData(oldContract);

                // Add new Data
                Object.assign(oldContract, req);

                // Save Data
                const result = await transaction.save(oldContract);

                if (result) {
                    this._logger.update(oldContract);

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
        req: ContractRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ContractInfoEntity ? id.id : id;
                const contract = await this.findOne(id, repo, transaction);

                if (contract instanceof ContractInfoEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ContractInfoEntity, contract.id);

                        this._logger.delete(contract);
                    } else {
                        await transaction.softDelete(ContractInfoEntity, contract.id);

                        this._logger.softDelete(contract);
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
    ): SelectQueryBuilder<ContractInfoEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('ec', manager?.queryRunner)
            .leftJoinAndSelect('ec.employee', 'emp')
            .leftJoinAndSelect('emp.picture', 'picture')
            .leftJoinAndSelect('emp.login', 'login')
            .leftJoinAndSelect('ec.typeEntry', 'te')
            .leftJoinAndSelect('ec.typePayment', 'tp')
            .leftJoinAndSelect('ec.level', 'l')
            .leftJoinAndSelect('ec.apprentice', 'ap')
            .leftJoinAndSelect('ec.section', 's')
            .leftJoinAndSelect('ec.jobDescription', 'jd');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ContractInfoEntity>,
        filter?: ContractFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('job')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.job) qb.andWhere(`${this._cn('job')} ILIKE :job`, { job: `%${filter.job}%` });

            if (filter.jobs?.length) qb.andWhere(`${this._cn('job')} IN (:...jobs)`, { names: filter.jobs });

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });

            if (filter.jobDescriptionId) qb.andWhere(`${this._cn('jobDescriptionId')} = :jobDescriptionId`, { jobDescriptionId: filter.jobDescriptionId });

            if (filter.jobDescriptionIds?.length) qb.andWhere(`${this._cn('jobDescriptionIds')} IN (:...jobDescriptionIds)`, { jobDescriptionIds: filter.jobDescriptionIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<ContractInfoEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ContractInfoService.ColumnQueryNames.get(columnName);
    }

}
