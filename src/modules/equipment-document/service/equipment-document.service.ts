import { Inject, Injectable } from '@nestjs/common';
import { EquipmentDocumentEntity } from 'src/entities/psql/EquipmentDocumentEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentDocumentCreateArgInput } from '../dto/args/equipment-document.create.arg.input';
import { EquipmentDocumentFilterArgInput } from '../dto/args/equipment-document.filter.arg.input';
import { EquipmentDocumentRemoveArgInput } from '../dto/args/equipment-document.remove.arg.input';
import { EquipmentDocumentUpdateArgInput } from '../dto/args/equipment-document.update.arg.input';
import { EquipmentDocumentPaginationResultInterface } from '../dto/interfaces/equipment-document.pagination.result.interface';
import { EQUIPMENT_DOCUMENT_PROVIDERS_NAMES } from '../dto/provider/equipment-document.providers';
import { EquipmentDocumentLogger } from '../logger/equipment-document.logger';
import { dateToTimestamp } from 'src/utils/utils';

@Injectable()
export class EquipmentDocumentService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'ed.id'],
        ['title', 'ed.title'],
        ['description', 'ed.description'],
        ['startDate', 'ed.startDate'],
        ['endDate', 'ed.endDate'],
        ['employeeId', 'emp.id'],
        ['employee', 'emp.id'],
        ['employee.firstname', 'emp.firstname'],
        ['employee.lastname', 'emp.lastname'],
        ['documentTypeId', 'dt.id'],
        ['documentType', 'dt.id'],
        ['documentType.title', 'dt.title'],
        ['active', 'ed.active'],
        ['createdAt', 'ed.createdAt'],
        ['updatedAt', 'ed.updatedAt'],
        ['deletedAt', 'ed.deletedAt'],
        ['createdBy', 'ed.createdBy'],
        ['updatedBy', 'ed.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(EQUIPMENT_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<EquipmentDocumentEntity>,
        private readonly _logger: EquipmentDocumentLogger,
    ) {
        super();
    }

    /**
     * Check if Equipment Document Type Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | EquipmentDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EquipmentDocumentEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found EquipmentDocument by column search and is value
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
        id?: number | EquipmentDocumentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof EquipmentDocumentEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('ed', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (EquipmentDocumentEntity.isColumnString(column)) {
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
     * Return all Equipment Document
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: EquipmentDocumentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentDocumentEntity[]> {
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
    public async findEquipmentDocumentAndPaginationAll(
        filter: EquipmentDocumentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentDocumentPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Equipment Document Type by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | EquipmentDocumentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentDocumentEntity> {
        if (id instanceof EquipmentDocumentEntity) id = id.id;
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
    ): Promise<EquipmentDocumentEntity> {
        const qb = this._initSelect(repo, manager);

        if (EquipmentDocumentEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Equipment document
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: EquipmentDocumentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentDocumentEntity> {
        return this.useTransaction(async transaction => {

            // Init new Entity Equipment Document Type
            const equipmentDocument = new EquipmentDocumentEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(equipmentDocument, rest);

            // Save hit
            const result = await transaction.save(equipmentDocument);

            if (result) {
                this._logger.create(equipmentDocument);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Equipment Document
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: EquipmentDocumentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentDocumentEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldEquipmentDocument = await this.findOne(id, repo, transaction);

            if (oldEquipmentDocument) {
                // Set old data
                this._logger.setOldData(oldEquipmentDocument);

                // Add new Data
                Object.assign(oldEquipmentDocument, req);

                // Save Data
                const result = await transaction.save(oldEquipmentDocument);

                if (result) {
                    this._logger.update(oldEquipmentDocument);

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
        req: EquipmentDocumentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof EquipmentDocumentEntity ? id.id : id;
                const equipmentDocument = await this.findOne(id, repo, transaction);

                if (equipmentDocument instanceof EquipmentDocumentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(EquipmentDocumentEntity, equipmentDocument.id);

                        this._logger.delete(equipmentDocument);
                    } else {
                        await transaction.softDelete(EquipmentDocumentEntity, equipmentDocument.id);

                        this._logger.softDelete(equipmentDocument);
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
    ): SelectQueryBuilder<EquipmentDocumentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('ed', manager?.queryRunner)
            .leftJoinAndSelect('ed.documentType', 'dt')
            .leftJoinAndSelect('dt.category', 'category')
            .leftJoinAndSelect('ed.employee', 'emp')
            .leftJoinAndSelect('emp.picture', 'picture')
            .leftJoinAndSelect('emp.login', 'login');
        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<EquipmentDocumentEntity>,
        filter?: EquipmentDocumentFilterArgInput,
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

            if (filter.documentTypeId) qb.andWhere(`${this._cn('documentTypeId')} = :documentTypeId`, { documentTypeId: filter.documentTypeId });

            if (filter.documentTypeIds?.length) qb.andWhere(`${this._cn('documentTypeId')} IN (:...documentTypeIds)`, { documentTypeIds: filter.documentTypeIds });

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });

            let startDateTransormed: string, endDateTransormed: string;
            if (filter.startDate && (startDateTransormed = dateToTimestamp(filter.startDate, 'date'))) {
                qb.andWhere(`to_char(${this._cn('startDate')}, 'YYYY-MM-DD') = :startDate`, { startDate: startDateTransormed });
            }

            if (filter.endDate && (endDateTransormed = dateToTimestamp(filter.endDate, 'date'))) {
                qb.andWhere(`to_char(${this._cn('endDate')}, 'YYYY-MM-DD') = :endDate`, { endDate: endDateTransormed });
            }
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<EquipmentDocumentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return EquipmentDocumentService.ColumnQueryNames.get(columnName);
    }

}
