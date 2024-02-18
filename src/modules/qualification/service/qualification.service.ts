import { Inject, Injectable } from '@nestjs/common';
import { QualificationEntity } from 'src/entities/psql/QualificationEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { QualificationCreateArgInput } from '../dto/args/qualification.create.arg.input';
import { QualificationFilterArgInput } from '../dto/args/qualification.filter.arg.input';
import { QualificationRemoveArgInput } from '../dto/args/qualification.remove.arg.input';
import { QualificationUpdateArgInput } from '../dto/args/qualification.update.arg.input';
import { QualificationPaginationResultInterface } from '../dto/interfaces/qualification.pagination.result.interface';
import { QUALIFICATION_PROVIDERS_NAMES } from '../dto/provider/qualification.providers';
import { EmployeeService } from 'src/modules/employee/service/employee.service';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { QualificationNameService } from 'src/modules/qualification-name/service/qualification-name.service';
import { QualificationStatusEnum } from '../dto/enums/qualification.status.enum';
import { QualificationLogger } from '../logger/qualification.logger';

@Injectable()
export class QualificationService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'q.id'],
        ['number', 'q.number'],
        ['delivery', 'q.delivery'],
        ['deadline', 'q.deadline'],
        ['validity', 'q.validity'],
        ['comment', 'q.comment'],
        ['status', 'q.status'],
        ['fromMyAccount', 'q.fromMyAccount'],
        ['name', 'n.id'],
        ['name.name', 'n.name'],
        ['employeeId', 'emp.id'],
        ['employee', 'emp.id'],
        ['employee.firstname', 'emp.firstname'],
        ['employee.lastname', 'emp.lastname'],
        ['sexe', 'emp.gender'],
        ['entity', 'ent.id'],
        ['entity.label', 'ent.label'],
        ['department', 'dep.id'],
        ['department.name', 'dep.name'],
        ['type', 't.id'],
        ['type.name', 't.name'],
        ['document', 'doc.id',],
        ['documentName', 'doc.name',],
        ['active', 'q.active'],
        ['createdAt', 'q.createdAt'],
        ['updatedAt', 'q.updatedAt'],
        ['deletedAt', 'q.deletedAt'],
        ['createdBy', 'q.createdBy'],
        ['updatedBy', 'q.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(QUALIFICATION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<QualificationEntity>,
        private readonly _logger: QualificationLogger,
        private readonly _employeeService: EmployeeService,
        private readonly _uploadService: UploadService,
        private readonly _qualificationNameService: QualificationNameService,
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
        id?: number | QualificationEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof QualificationEntity) id = id.id;

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
        id?: number | QualificationEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof QualificationEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('q', manager?.queryRunner)
                .leftJoin('q.document', 'doc');

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (QualificationEntity.isColumnString(column)) {
                if (column === 'documentName' && !UploadService.isValidFilename(value)) {
                    value = UploadService.renameFilename(value);
                }
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
        filter?: QualificationFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QualificationEntity[]> {
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
    public async findQualificationsAndPaginationAll(
        filter: QualificationFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QualificationPaginationResultInterface> {
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
        id: number | QualificationEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QualificationEntity> {
        if (id instanceof QualificationEntity) id = id.id;
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
    ): Promise<QualificationEntity> {
        const qb = this._initSelect(repo, manager);

        if (QualificationEntity.isColumnString(column)) {
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
        data: QualificationCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QualificationEntity> {
        return this.useTransaction(async transaction => {
            if (data.employee) {
                data.employee = await this._employeeService.findOne(data.employee, null, transaction);
                data.entity = data.employee.entity;
                data.department = data.employee.department;
            }

            // Init new Entity Quick Access
            const qualification = new QualificationEntity();

            // Get uploaded file
            const { document, documentName, ...rest } = data;

            if (document) {
                qualification.document = await this._uploadService.saveFromGraphqlUpload(document, null, upl => {
                    if (documentName) upl.name = documentName;
                }, null, null, transaction);
            }

            if (rest.name) {
                rest.name = await this._qualificationNameService.findOne(rest.name, null, transaction);
                rest.validity = rest.name.validity;

                if (rest.delivery && rest.validity) {
                    rest.deadline = new Date(rest.delivery.getTime());

                    rest.deadline.setMonth(rest.deadline.getMonth() + rest.validity);
                }
            }

            // Set Data
            Object.assign(qualification, rest);

            if (rest.fromMyAccount) qualification.status = QualificationStatusEnum.WAITING_VALIDATION;

            // Save hit
            const result = await transaction.save(qualification);

            if (result) {
                this._logger.create(qualification);

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
        data: QualificationUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<QualificationEntity> {
        return this.useTransaction(async transaction => {
            if (data.employee) {
                data.employee = await this._employeeService.findOne(data.employee, null, transaction);
                data.entity = data.employee.entity;
                data.department = data.employee.department;
            }

            // Extract ID
            const { id, document, documentName, ...req } = data;

            // Find existing
            const oldQualification = await this.findOne(id, repo, transaction);

            if (oldQualification) {
                // Set old data
                this._logger.setOldData(oldQualification);

                if (document) {
                    oldQualification.document = await this._uploadService.saveFromGraphqlUpload(document, null, upl => {
                        if (documentName) upl.name = documentName;
                    }, oldQualification.document, null, transaction);
                }

                if (req.name) {
                    req.name = await this._qualificationNameService.findOne(req.name, null, transaction);
                    req.validity = req.name.validity;

                    if (req.delivery && req.validity) {
                        req.deadline = new Date(req.delivery.getTime());

                        req.deadline.setMonth(req.deadline.getMonth() + req.validity);
                    }
                }

                // Add new Data
                Object.assign(oldQualification, req);

                if (req.fromMyAccount) oldQualification.status = QualificationStatusEnum.WAITING_VALIDATION;

                // Save Data
                const result = await transaction.save(oldQualification);

                if (result) {
                    this._logger.update(oldQualification);

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
        req: QualificationRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof QualificationEntity ? id.id : id;
                const qualification = await this.findOne(id, repo, transaction);

                if (qualification instanceof QualificationEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        if (qualification.document) {
                            const result = await this._uploadService.remove({
                                id: qualification.document,
                                type: REMOVE_TYPES.HARD,
                            }, null, transaction);
                        }

                        await transaction.delete(QualificationEntity, qualification.id);

                        this._logger.delete(qualification);
                    } else {
                        await transaction.softDelete(QualificationEntity, qualification.id);

                        this._logger.softDelete(qualification);
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
    ): SelectQueryBuilder<QualificationEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('q', manager?.queryRunner)
            .leftJoinAndSelect('q.entity', 'ent')
            .leftJoinAndSelect('q.department', 'dep')
            .leftJoinAndSelect('q.employee', 'emp')
            .leftJoinAndSelect('q.type', 't')
            .leftJoinAndSelect('q.name', 'n')
            .leftJoinAndSelect('q.document', 'doc');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<QualificationEntity>,
        filter?: QualificationFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('number')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('comment')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`((${this._cn('status')})::text ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('employee.firstname')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('employee.lastname')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('name.name')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('sexe')}::text ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('entity.label')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('department.name')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('type.name')} ILIKE :search)`, { search: `%${filter.search}%` });

                }));
            }

            if (filter.entity) qb.andWhere(`${this._cn('entity')} = :entity`, { entity: filter.entity });

            if (filter.entities?.length) qb.andWhere(`${this._cn('entity')} IN (:...entities)`, { entities: filter.entities });

            if (filter.department) qb.andWhere(`${this._cn('department')} = :department`, { department: filter.department });

            if (filter.departments?.length) qb.andWhere(`${this._cn('department')} IN (:...departments)`, { departments: filter.departments });

            if (filter.type) qb.andWhere(`${this._cn('type')} = :type`, { type: filter.type });

            if (filter.types?.length) qb.andWhere(`${this._cn('type')} IN (:...types)`, { types: filter.types });

            if (filter.name) qb.andWhere(`${this._cn('name')} = :name`, { name: filter.name });

            if (filter.names?.length) qb.andWhere(`${this._cn('name')} IN (:...names)`, { names: filter.names });

            if (filter.sexe) qb.andWhere(`${this._cn('sexe')} = :sexe`, { sexe: filter.sexe });

            if (filter.sexes?.length) qb.andWhere(`${this._cn('sexe')} IN (:...sexes)`, { sexes: filter.sexes });

            if (filter.status) qb.andWhere(`(${this._cn('status')})::text ILIKE :status`, { status: filter.status });

            if (filter.statuses?.length) qb.andWhere(`(${this._cn('status')})::text IN (:...statuses)`, { statuses: filter.statuses });

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<QualificationEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return QualificationService.ColumnQueryNames.get(columnName);
    }

}
