import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { EquipmentCreateArgInput } from '../dto/args/equipment.create.arg.input';
import { EquipmentFilterArgInput } from '../dto/args/equipment.filter.arg.input';
import { EquipmentRemoveArgInput } from '../dto/args/equipment.remove.arg.input';
import { EquipmentUpdateArgInput } from '../dto/args/equipment.update.arg.input';
import { EquipmentPaginationResultInterface } from '../dto/interfaces/equipment.pagination.result.interface';
import { EQUIPMENT_PROVIDERS_NAMES } from '../dto/provider/equipment.providers';
import { EquipmentEntity } from 'src/entities/psql/EquipmentEntity';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { EquipmentLogger } from '../logger/equipment.logger';
import { dateToTimestamp } from 'src/utils/utils';

@Injectable()
export class EquipmentService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'e.id'],
        ['denomination', 'e.denomination'],
        ['registrationNumber', 'e.registrationNumber'],
        ['orderNumber', 'e.orderNumber'],
        ['type', 'e.type'],
        ['available', 'e.available'],
        ['startDate', 'e.startDate'],
        ['endDate', 'e.endDate'],
        ['orderDate', 'e.orderDate'],
        ['deliveryDate', 'e.deliveryDate'],
        ['firstCirculation', 'e.firstCirculation'],
        ['registrationDate', 'e.registrationDate'],
        ['originalValue', 'e.originalValue'],
        ['standardCost', 'e.standardCost'],
        ['co2Emissions', 'e.co2Emissions'],
        ['counter', 'e.counter'],
        ['employeeId', 'emp.id'],
        ['employee', 'emp.id'],
        ['employee.firstname', 'emp.firstname'],
        ['employee.lastname', 'emp.lastname'],
        ['categorieId', 'c.id'],
        ['categorie', 'c.id'],
        ['categorie.code', 'c.code'],
        ['categorie.title', 'c.title'],
        ['categorie.costPrice', 'c.costPrice'],
        ['categorie.workUnit', 'c.workUnit'],
        ['entityId', 'ent.id'],
        ['entity', 'ent.id'],
        ['entity.label', 'ent.label'],
        ['photo', 'p.id'],
        ['photoName', 'p.name'],
        ['active', 'e.active'],
        ['createdAt', 'e.createdAt'],
        ['updatedAt', 'e.updatedAt'],
        ['deletedAt', 'e.deletedAt'],
        ['createdBy', 'e.createdBy'],
        ['updatedBy', 'e.updatedBy'],
    ]);

    /**
     * Constructor of EQUIPMENT service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(EQUIPMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<EquipmentEntity>,
        private readonly _logger: EquipmentLogger,
        private readonly _uploadService: UploadService,
    ) {
        super();
    }

    /**
     * Check if Equipment Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | EquipmentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EquipmentEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found Quick Access by by column search and is value
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
        id?: number | EquipmentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof EquipmentEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('e', manager?.queryRunner)
                .leftJoin('e.photo', 'p');


            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);


            if (EquipmentEntity.isColumnString(column)) {
                if (column === 'photoName' && !UploadService.isValidFilename(value)) {
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
     * Return all Equipment
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: EquipmentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentEntity[]> {
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
    public async findEquipmentAndPaginationAll(
        filter: EquipmentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Equipment by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | EquipmentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentEntity> {
        if (id instanceof EquipmentEntity) id = id.id;
        return this.findByColumn("id", id, repo, manager);
    }

    /**
     * Return an existing Equipment by his column value
     * @param column 
     * @param value 
     * @param repo 
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentEntity> {
        const qb = this._initSelect(repo, manager);

        if (EquipmentEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }


    /**
     * Generate park number
     * @param categoryNumber 
     * @param entityNumber 
     * @param uniqueIdentifier 
     * @returns 
     */
    public async generateParkNumber(
        categoryNumber: number,
        entityNumber: number,
        uniqueIdentifier: string
    ): Promise<string> {
        const parkNumber = `${categoryNumber}/${entityNumber}/${uniqueIdentifier}`;
        return parkNumber;
    }

    /**
     * Get the last entry
     */
    public async getLastEntry(
        repo?: string,
        manager?: EntityManager,
    ): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const result = await this.getRepo(repo)
                .createQueryBuilder('e', manager?.queryRunner)
                .withDeleted()
                .select('e.uniqueIdentifier', 'uniqueIdentifier')
                .orderBy('e.id', 'DESC')
                .limit(1)
                .getRawOne();

            if (result?.uniqueIdentifier) {
                resolve(parseInt(result.uniqueIdentifier));
            } else {
                resolve(0);
            }
        });
    }


    /**
     * Create new Equipment
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: EquipmentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentEntity> {
        return this.useTransaction(async transaction => {

            //retrieve last entry
            const lastCode = await this.getLastEntry(repo, transaction);

            //Generate new code
            const newCode = (lastCode + 1).toString().padStart(3, '0');

            //Init new Entity Equipment
            const Equipment = new EquipmentEntity();

            //Init value of unique identifier 
            Equipment.uniqueIdentifier = newCode

            //Get uploaded file
            const { photo, photoName, ...rest } = data;

            console.log("Equip:::::::::::::", data.entity.colorGradiantLeft)

            //Init value of park number code
            Equipment.code = await this.generateParkNumber(data.categorie.id, data.entity.id, Equipment.uniqueIdentifier);

            if (photo) {
                Equipment.photo = await this._uploadService.saveFromGraphqlUpload(photo, null, upl => {
                    if (photoName) upl.name = photoName;
                }, null, null, transaction);
            }

            // Set Data
            Object.assign(Equipment, rest);

            // Save hit
            const result = await transaction.save(Equipment);

            if (result) {
                this._logger.create(Equipment);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }


    /**
     * Update new Equipment
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: EquipmentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EquipmentEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, photo, photoName, ...req } = data;

            // Find existing
            const oldEquipment = await this.findOne(id, repo, transaction);

            if (oldEquipment) {
                // Set old data
                this._logger.setOldData(oldEquipment);

                if (photo) {
                    oldEquipment.photo = await this._uploadService.saveFromGraphqlUpload(photo, null, upl => {
                        if (photoName) upl.name = photoName;
                    }, oldEquipment.photo, null, transaction);
                }

                // Add new Data
                Object.assign(oldEquipment, req);

                // Save it
                const result = await transaction.save(oldEquipment);

                if (result) {
                    this._logger.update(oldEquipment);

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
        req: EquipmentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof EquipmentEntity ? id.id : id;
                const Equipment = await this.findOne(id, repo, transaction);

                if (Equipment instanceof EquipmentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(EquipmentEntity, Equipment.id);

                        if (Equipment.photo) {
                            const result = await this._uploadService.remove({
                                id: Equipment.photo,
                                type: REMOVE_TYPES.HARD,
                            }, null, transaction);
                        }

                        this._logger.delete(Equipment);
                    } else {
                        await transaction.softDelete(EquipmentEntity, Equipment.id);

                        this._logger.softDelete(Equipment);
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
    ): SelectQueryBuilder<EquipmentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('e', manager?.queryRunner)
            .leftJoinAndSelect('e.photo', 'p')
            .leftJoinAndSelect('e.categorie', 'c')
            .leftJoinAndSelect('c.mediumSizedCentre', 'mediumSizedCentre')
            .leftJoinAndSelect('e.entity', 'ent')
            .leftJoinAndSelect('e.employee', 'emp')
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
        qb: SelectQueryBuilder<EquipmentEntity>,
        filter?: EquipmentFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('denomination')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('registrationNumber')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, { search: `%${filter.search}%` });
                    _qb.orWhere(`(${this._cn('orderNumber')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });

            if (filter.categorieId) qb.andWhere(`${this._cn('categorieId')} = :categorieId`, { categorieId: filter.categorieId });

            if (filter.categorieIds?.length) qb.andWhere(`${this._cn('categorieId')} IN (:...categorieIds)`, { categorieIds: filter.categorieIds });

            if (filter.entityId) qb.andWhere(`${this._cn('entityId')} = :entityId`, { entityId: filter.entityId });

            if (filter.entityIds?.length) qb.andWhere(`${this._cn('entityId')} IN (:...entityIds)`, { entityIds: filter.entityIds });

            if (filter.available) qb.andWhere(`${this._cn('available')}::text = :available`, { available: filter.available });

            if (filter.availables?.length) qb.andWhere(`${this._cn('available')} IN (:...availables)`, { availables: filter.availables });

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

    public getRepo(repo?: string): Repository<EquipmentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return EquipmentService.ColumnQueryNames.get(columnName);
    }

}
