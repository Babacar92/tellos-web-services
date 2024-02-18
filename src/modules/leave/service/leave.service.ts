import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder, Transaction } from 'typeorm';
import { LeaveCreateArgInput } from '../dto/args/leave.create.arg.input';
import { LeaveFilterArgInput } from '../dto/args/leave.filter.arg.input';
import { LeaveRemoveArgInput } from '../dto/args/leave.remove.arg.input';
import { LeaveUpdateArgInput } from '../dto/args/leave.update.arg.input';
import { LeavePaginationResultInterface } from '../dto/interfaces/leave.pagination.result.interface';
import { LEAVE_PROVIDERS_NAMES } from '../dto/provider/leave.providers';
import { LeaveEntity } from 'src/entities/psql/LeaveEntity';
import { LeaveDistributionService } from 'src/modules/leave-distribution/service/leave-distribution.service';
import { LeaveLogger } from '../logger/leave.logger';
@Injectable()
export class LeaveService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ["id", "l.id"],
        ["ids", "l.ids"],
        ["employee", "emp.id"],
        ["employeeId", "emp.id"],
        ["leavePeriod", "lp.id"],
        ["leavePeriodId", "lp.id"],
        ["entity", "ent.id"],
        ["entityId", "ent.id"],
        ["service", "s.id"],
        ["serviceId", "s.id"],
        ["decisionMaker", "dm.id"],
        ["decisionMakerId", "dm.id"],
        ['decisionMakerField', 'l.decisionMaker'],
        ["motive", "l.motive"],
        ["startDate", "l.startDate"],
        ["endDate", "l.endDate"],
        ["contract", "l.contract"],
        ["decision", "l.decision"],
        ["startDay", "l.startDay"],
        ["endDay", "l.endDay"],
        ["gender", "l.gender"],
        ["active", "l.active"],
        ["createdAt", "l.createdAt"],
        ["updatedAt", "l.updatedAt"],
        ["deletedAt", "l.deletedAt"],
        ["createdBy", "l.createdBy"],
        ["updatedBy", "l.updatedBy"],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(LEAVE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<LeaveEntity>,
        private readonly _logger: LeaveLogger,
        private readonly _leaveDistributionService: LeaveDistributionService,
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
        id?: number | LeaveEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof LeaveEntity) id = id.id;

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
        id?: number | LeaveEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof LeaveEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('l', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (LeaveEntity.isColumnString(column)) {
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
        filter?: LeaveFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveEntity[]> {
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
    public async findLeavesAndPaginationAll(
        filter: LeaveFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeavePaginationResultInterface> {
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
        id: number | LeaveEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveEntity> {
        if (id instanceof LeaveEntity) id = id.id;
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
    ): Promise<LeaveEntity> {
        const qb = this._initSelect(repo, manager);

        if (LeaveEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Leave
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: LeaveCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Leave
            const newLeave = new LeaveEntity();

            // Get uploaded file
            const { types, ...rest } = data;

            // Set Data
            Object.assign(newLeave, rest);

            if (types) {
                newLeave.distributions = [];
                for (const i in types) {
                    const type = types[i];
                    newLeave.distributions.push(await this._leaveDistributionService.saveLeaveDistribution(type))

                }
            }

            // Save hit
            const result = await transaction.save(newLeave);

            if (result) {
                this._logger.create(newLeave);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
    * validate Leave
    * @param data 
    * @param repo 
    * @param manager 
    * @returns 
    */
    public async validateLeave(
        data: LeaveUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveEntity[]> {

        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ids, ...req } = data;

            if (id) {
                const validateLeave = await this.findOne(id, repo, transaction)
                if (validateLeave) {

                    // Set old data
                    this._logger.setOldData(validateLeave);

                    // Add new Data
                    Object.assign(validateLeave, req);
                    // Save Data
                    const result = await transaction.save(validateLeave);

                    if (result) {
                        this._logger.update(validateLeave);

                        return this.findOne(id, repo, transaction);
                    }
                }
            } else {
                await Promise.all(
                    ids.map(async id => {
                        const validateLeave = await this.findOne(id, repo, transaction);
                        if (validateLeave) {

                            // Set old data
                            this._logger.setOldData(validateLeave);

                            // Add new Data
                            Object.assign(validateLeave, req);

                            // Save Data
                            const result = await transaction.save(validateLeave);

                            if (result) {
                                this._logger.update(validateLeave);
                                return this.findOne(id, repo, transaction);

                            }
                        }

                    })

                )

            }


        }, (manager || repo))

    }

    /**
     * Update new Leave
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: LeaveUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LeaveEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, types, ...req } = data;

            // Find existing
            const oldLeave = await this.findOne(id, repo, transaction);

            if (oldLeave) {
                // Set old data
                this._logger.setOldData(oldLeave);

                if (types) {
                    oldLeave.distributions = await this._leaveDistributionService.saveMultipleLeaveDistribution(types)
                }

                // Add new Data
                Object.assign(oldLeave, req);

                // Save Data
                const result = await transaction.save(oldLeave);

                if (result) {
                    this._logger.update(oldLeave);

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
        req: LeaveRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof LeaveEntity ? id.id : id;
                const Leave = await this.findOne(id, repo, transaction);

                if (Leave instanceof LeaveEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(LeaveEntity, Leave.id);

                        this._logger.delete(Leave);
                    } else {
                        await transaction.softDelete(LeaveEntity, Leave.id);

                        this._logger.softDelete(Leave);
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
    ): SelectQueryBuilder<LeaveEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('l', manager?.queryRunner)
            .leftJoinAndSelect('l.employee', 'emp')
            .leftJoinAndSelect('l.leavePeriod', 'lp')
            .leftJoinAndSelect('emp.entity', 'entity')
            .leftJoinAndSelect('l.entity', 'ent')
            .leftJoinAndSelect('l.decisionMaker', 'dm')
            .leftJoinAndSelect('l.distributions', 'dist')
            .leftJoinAndSelect('l.service', 's');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<LeaveEntity>,
        filter?: LeaveFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('employee.firstname')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('employee.lastname')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('entity.label')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('service.name')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('decision')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('contract')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('gender')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));

            }

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeIds')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });

            if (filter.decisionMakerId) qb.andWhere(`${this._cn('decisionMakerId')} = :decisionMakerId`, { decisionMakerId: filter.decisionMakerId });

            if (filter.decisionMakerIds?.length) qb.andWhere(`${this._cn('decisionMakerIds')} IN (:...decisionMakerIds)`, { decisionMakerIds: filter.decisionMakerIds });

            if (filter.serviceId) qb.andWhere(`${this._cn('serviceId')} = :serviceId`, { serviceId: filter.serviceId });

            if (filter.serviceIds?.length) qb.andWhere(`${this._cn('serviceIds')} IN (:...serviceIds)`, { serviceIds: filter.serviceIds });

            if (filter.entityId) qb.andWhere(`${this._cn('entityId')} = :entityId`, { entityId: filter.entityId });

            if (filter.entityIds?.length) qb.andWhere(`${this._cn('entityIds')} IN (:...entityIds)`, { entityIds: filter.entityIds });

            if (filter.decision) qb.andWhere(`${this._cn('decision')}::text = :decision`, { decision: filter.decision });

            if (filter.decisions?.length) qb.andWhere(`${this._cn('decision')} IN (:...decisions)`, { decisions: filter.decisions });

            if (filter.gender) qb.andWhere(`${this._cn('gender')}::text = :gender`, { gender: filter.gender });

            if (filter.genders?.length) qb.andWhere(`${this._cn('genders')} IN (:...genders)`, { genders: filter.genders });

            if (filter.contract) qb.andWhere(`${this._cn('contract')}::text = :contract`, { contract: filter.contract });

            if (filter.contracts?.length) qb.andWhere(`${this._cn('contract')} IN (:...contracts)`, { contracts: filter.contracts });

            if (filter.leavePeriodId) qb.andWhere(`${this._cn('leavePeriodId')} = :leavePeriodId`, { leavePeriodId: filter.leavePeriodId });

            if (filter.leavePeriodIds?.length) qb.andWhere(`${this._cn('leavePeriodIds')} IN (:...leavePeriodIds)`, { leavePeriodIds: filter.leavePeriodIds });

            if (filter.hasNotDecisionMaker) qb.andWhere(`${this._cn('decisionMakerField')} IS NULL`);

        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<LeaveEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return LeaveService.ColumnQueryNames.get(columnName);
    }

}
