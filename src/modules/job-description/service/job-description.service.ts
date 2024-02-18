import { Inject, Injectable } from '@nestjs/common';
import { JobDescriptionEntity } from 'src/entities/psql/JobDescriptionEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { JobDescriptionCreateArgInput } from '../dto/args/job-description.create.arg.input';
import { JobDescriptionFilterArgInput } from '../dto/args/job-description.filter.arg.input';
import { JobDescriptionRemoveArgInput } from '../dto/args/job-description.remove.arg.input';
import { JobDescriptionUpdateArgInput } from '../dto/args/job-description.update.arg.input';
import { JobDescriptionPaginationResultInterface } from '../dto/interfaces/job-description.pagination.result.interface';
import { JOB_DESCRIPTION_PROVIDERS_NAMES } from '../dto/provider/job-description.providers';
import { JobDescriptionLogger } from '../logger/job-description.logger';
import { UploadService } from '@/libs/upload/service/upload.service';

@Injectable()
export class JobDescriptionService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'jd.id'],
        ['entity', 'e.id'],
        ['entityId', 'e.id'],
        ['department', 'd.id'],
        ['departmentId', 'd.id'],
        ['number', 'jd.number'],
        ['title', 'jd.title'],
        ['description', 'jd.description'],
        ['totalEmployees', 'jd.totalEmployees'],
        ['file', 'f.id'],
        ['fileId', 'f.id'],
        ['fileName', 'f.name'],
        ['fileOriginalName', 'f.originalName'],
        ['active', 'jd.active'],
        ['createdAt', 'jd.createdAt'],
        ['updatedAt', 'jd.updatedAt'],
        ['deletedAt', 'jd.deletedAt'],
        ['createdBy', 'jd.createdBy'],
        ['updatedBy', 'jd.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(JOB_DESCRIPTION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<JobDescriptionEntity>,
        private readonly _logger: JobDescriptionLogger,
        private readonly _uploadService: UploadService,
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
        id?: number | JobDescriptionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof JobDescriptionEntity) id = id.id;

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
        id?: number | JobDescriptionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof JobDescriptionEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('jd', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (JobDescriptionEntity.isColumnString(column)) {
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
        filter?: JobDescriptionFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<JobDescriptionEntity[]> {
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
    public async findJobDescriptionAndPaginationAll(
        filter: JobDescriptionFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<JobDescriptionPaginationResultInterface> {
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
        id: number | JobDescriptionEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<JobDescriptionEntity> {
        if (id instanceof JobDescriptionEntity) id = id.id;
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
    ): Promise<JobDescriptionEntity> {
        const qb = this._initSelect(repo, manager);

        if (JobDescriptionEntity.isColumnString(column)) {
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
        data: JobDescriptionCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<JobDescriptionEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const jobDescription = new JobDescriptionEntity();

            // Get uploaded file
            const { file, ...rest } = data;

            if (file) {
                jobDescription.file = await this._uploadService.saveFromGraphqlUpload(
                  file,
                  null,
                  null,
                  null,
                  null,
                  transaction,
                );
              }

            // Set Data
            Object.assign(jobDescription, rest);

            // Save hit
            const result = await transaction.save(jobDescription);

            if (result) {
                this._logger.create(jobDescription);

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
        data: JobDescriptionUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<JobDescriptionEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, file, ...req } = data;

            // Find existing
            const oldJobDescription = await this.findOne(id, repo, transaction);

            if (oldJobDescription) {
                // Set old data
                this._logger.setOldData(oldJobDescription);

                if (file) {
                    oldJobDescription.file =
                      await this._uploadService.saveFromGraphqlUpload(
                        file,
                        null,
                        null,
                        oldJobDescription.file,
                        null,
                        transaction,
                      );
                }

                // Add new Data
                Object.assign(oldJobDescription, req);

                // Save Data
                const result = await transaction.save(oldJobDescription);

                if (result) {
                    this._logger.update(oldJobDescription);

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
        req: JobDescriptionRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof JobDescriptionEntity ? id.id : id;
                const jobDescription = await this.findOne(id, repo, transaction);

                if (jobDescription instanceof JobDescriptionEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(JobDescriptionEntity, jobDescription.id);

                        this._logger.delete(jobDescription);
                    } else {
                        await transaction.softDelete(JobDescriptionEntity, jobDescription.id);

                        this._logger.softDelete(jobDescription);
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
    ): SelectQueryBuilder<JobDescriptionEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('jd', manager?.queryRunner)
            .leftJoinAndSelect('jd.entity', 'e')
            .leftJoinAndSelect('jd.department', 'd')
            .leftJoinAndSelect('jd.contractsInfos', 'ci')
            .leftJoinAndSelect('jd.file', 'f')
            ;

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<JobDescriptionEntity>,
        filter?: JobDescriptionFilterArgInput,
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

            if (filter.entities?.length) qb.andWhere(`${this._cn('entityId')} IN (:...entities)`, { entities: filter.entities });

            if (filter.departments?.length) qb.andWhere(`${this._cn('departmentId')} IN (:...departments)`, { departments: filter.departments });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<JobDescriptionEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return JobDescriptionService.ColumnQueryNames.get(columnName);
    }

}
