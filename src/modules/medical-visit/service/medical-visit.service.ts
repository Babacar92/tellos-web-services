import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { MedicalVisitCreateArgInput } from '../dto/args/medical-visit.create.arg.input';
import { MedicalVisitFilterArgInput } from '../dto/args/medical-visit.filter.arg.input';
import { MedicalVisitRemoveArgInput } from '../dto/args/medical-visit.remove.arg.input';
import { MedicalVisitUpdateArgInput } from '../dto/args/medical-visit.update.arg.input';
import { MedicalVisitPaginationResultInterface } from '../dto/interfaces/medical-visit.pagination.result.interface';
import { MEDICAL_VISIT_PROVIDERS_NAMES } from '../dto/provider/medical-visit.providers';
import { MedicalVisitEntity } from 'src/entities/psql/MedicalVisitEntity';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { MedicalVisitLogger } from '../logger/medical-visit.logger';

@Injectable()
export class MedicalVisitService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'mv.id'],
        ['job', 'mv.job'],
        ['entity', 'mv.entity'],
        ['contract', 'mv.contract'],
        ['statut', 'mv.statut'],
        ['placeOfTheMedicalvisit', 'mv.placeOfTheMedicalvisit'],
        ['contraindication', 'mv.contraindication'],
        ['comment', 'mv.comment'],
        ['lastDateMedicalVisit', 'mv.lastDateMedicalVisit'],
        ['nextDateMedicalVisit', 'mv.nextDateMedicalVisit'],
        ['startDate', 'mv.startDate'],
        ['endDate', 'mv.endDate'],
        ['employeeId', 'emp.id'],
        ['employee', 'emp.id'],
        ['employee.firstname', 'emp.firstname'],
        ['employee.lastname', 'emp.lastname'],
        ['serviceId', 's.id'],
        ['service', 's.id'],
        ['service.name', 's.name'],
        ['file', 'fi.id'],
        ['fileName', 'fi.name'],
        ['editable', 'mv.editable'],
        ['active', 'mv.active'],
        ['createdAt', 'mv.createdAt'],
        ['updatedAt', 'mv.updatedAt'],
        ['deletedAt', 'mv.deletedAt'],
        ['createdBy', 'mv.createdBy'],
        ['updatedBy', 'mv.updatedBy'],
    ]);

    /**
     * Constructor of Medical Visit service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(MEDICAL_VISIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<MedicalVisitEntity>,
        private readonly _logger: MedicalVisitLogger,
        private readonly _uploadService: UploadService,
    ) {
        super();
    }

    /**
     * Check if Medical Visit Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | MedicalVisitEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof MedicalVisitEntity) id = id.id;

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
        id?: number | MedicalVisitEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof MedicalVisitEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('mv', manager?.queryRunner)
                .leftJoin('mv.file', 'fi');


            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);


            if (MedicalVisitEntity.isColumnString(column)) {
                if (column === 'fileName' && !UploadService.isValidFilename(value)) {
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
     * Return all Medical Visit
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: MedicalVisitFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MedicalVisitEntity[]> {
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
    public async findMedicalVisitAndPaginationAll(
        filter: MedicalVisitFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MedicalVisitPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Medical Visit by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | MedicalVisitEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MedicalVisitEntity> {
        if (id instanceof MedicalVisitEntity) id = id.id;
        return this.findByColumn("id", id, repo, manager);
    }

    /**
     * Return an existing Career Path by his column value
     * @param column 
     * @param value 
     * @param repo 
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MedicalVisitEntity> {
        const qb = this._initSelect(repo, manager);

        if (MedicalVisitEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Medical Visit
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: MedicalVisitCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MedicalVisitEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Medical Visit
            const MedicalVisit = new MedicalVisitEntity();

            // Get uploaded file
            const { file, fileName, ...rest } = data;

            if (file) {
                MedicalVisit.file = await this._uploadService.saveFromGraphqlUpload(file, null, upl => {
                    if (fileName) upl.name = fileName;
                }, null, null, transaction);
            }

            // Set Data
            Object.assign(MedicalVisit, rest);

            // Save hit
            const result = await transaction.save(MedicalVisit);

            if (result) {
                this._logger.create(MedicalVisit);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Medical Visit
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: MedicalVisitUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<MedicalVisitEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, file, fileName, ...req } = data;

            // Find existing
            const oldMedicalVisit = await this.findOne(id, repo, transaction);

            if (oldMedicalVisit) {
                // Set old data
                this._logger.setOldData(oldMedicalVisit);

                if (file) {
                    oldMedicalVisit.file = await this._uploadService.saveFromGraphqlUpload(file, null, upl => {
                        if (fileName) upl.name = fileName;
                    }, oldMedicalVisit.file, null, transaction);
                }

                // Add new Data
                Object.assign(oldMedicalVisit, req);

                // Save it
                const result = await transaction.save(oldMedicalVisit);

                if (result) {
                    this._logger.update(oldMedicalVisit);

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
        req: MedicalVisitRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof MedicalVisitEntity ? id.id : id;
                const MedicalVisit = await this.findOne(id, repo, transaction);

                if (MedicalVisit instanceof MedicalVisitEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        if (MedicalVisit.file) {
                            const result = await this._uploadService.remove({
                                id: MedicalVisit.file,
                                type: REMOVE_TYPES.HARD,
                            }, null, transaction);
                        }

                        await transaction.delete(MedicalVisitEntity, MedicalVisit.id);

                        this._logger.delete(MedicalVisit);
                    } else {
                        await transaction.softDelete(MedicalVisitEntity, MedicalVisit.id);

                        this._logger.softDelete(MedicalVisit);
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
    ): SelectQueryBuilder<MedicalVisitEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('mv', manager?.queryRunner)
            .leftJoinAndSelect('mv.file', 'fi')
            .leftJoinAndSelect('mv.employee', 'emp')
            .leftJoinAndSelect('emp.picture', 'picture')
            .leftJoinAndSelect('emp.login', 'login')
            .leftJoinAndSelect('mv.service', 's')
            .leftJoinAndSelect('s.leaves', 'leaves')
            .leftJoinAndSelect('mv.careerPaths', 'cp');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<MedicalVisitEntity>,
        filter?: MedicalVisitFilterArgInput,
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


            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: `%${filter.employeeId}%` });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeIds')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });

            if (filter.serviceId) qb.andWhere(`${this._cn('serviceId')} = :serviceId`, { serviceId: `%${filter.serviceId}%` });

            if (filter.serviceIds?.length) qb.andWhere(`${this._cn('serviceIds')} IN (:...serviceIds)`, { serviceIds: filter.serviceIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<MedicalVisitEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return MedicalVisitService.ColumnQueryNames.get(columnName);
    }

}
