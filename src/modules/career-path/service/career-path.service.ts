import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CareerPathCreateArgInput } from '../dto/args/career-path.create.arg.input';
import { CareerPathFilterArgInput } from '../dto/args/career-path.filter.arg.input';
import { CareerPathRemoveArgInput } from '../dto/args/career-path.remove.arg.input';
import { CareerPathUpdateArgInput } from '../dto/args/career-path.update.arg.input';
import { CareerPathPaginationResultInterface } from '../dto/interfaces/career-path.pagination.result.interface';
import { CAREER_PATH_PROVIDERS_NAMES } from '../dto/provider/career-path.providers';
import { CareerPathEntity } from 'src/entities/psql/CareerPathEntity';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { CareerPathLogger } from '../logger/career-path.logger';

@Injectable()
export class CareerPathService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'cp.id'],
        ['title', 'cp.title'],
        ['icon', 'cp.icon'],
        ['startDate', 'cp.startDate'],
        ['endDate', 'cp.endDate'],
        ['comment', 'cp.comment'],
        ['employeeId', 'emp.id'],
        ['employee', 'emp.id'],
        ['employee.firstname', 'emp.firstname'],
        ['employee.lastname', 'emp.lastname'],
        ['file', 'fi.id'],
        ['fileName', 'fi.name'],
        ['editable', 'cp.editable'],
        ['active', 'cp.active'],
        ['createdAt', 'cp.createdAt'],
        ['updatedAt', 'cp.updatedAt'],
        ['deletedAt', 'cp.deletedAt'],
        ['createdBy', 'cp.createdBy'],
        ['updatedBy', 'cp.updatedBy'],
    ]);

    /**
     * Constructor of CAREER PATH service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CAREER_PATH_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<CareerPathEntity>,
        private readonly _logger: CareerPathLogger,
        private readonly _uploadService: UploadService,
    ) {
        super();
    }

    /**
     * Check if Career Path Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | CareerPathEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof CareerPathEntity) id = id.id;

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
        id?: number | CareerPathEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof CareerPathEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('cp', manager?.queryRunner)
                .leftJoin('cp.file', 'fi');


            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);


            if (CareerPathEntity.isColumnString(column)) {
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
     * Return all Career Path
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: CareerPathFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CareerPathEntity[]> {
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
    public async findCareerPathAndPaginationAll(
        filter: CareerPathFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CareerPathPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one Career Path by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | CareerPathEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CareerPathEntity> {
        if (id instanceof CareerPathEntity) id = id.id;
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
    ): Promise<CareerPathEntity> {
        const qb = this._initSelect(repo, manager);

        if (CareerPathEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    public async countByType(
        repo?: string,
        manager?: EntityManager,
    ): Promise<{ [key: string]: number }> {
        return new Promise(async (resolve, reject) => {
            const qb = this.getRepo(repo)
                .createQueryBuilder('cp', manager?.queryRunner);

            qb.select('cp.icon', 'icon');

            qb.addSelect(_qb => _qb
                .select('COUNT(cp2.id)', 'total')
                .from(CareerPathEntity, 'cp2')
                .andWhere('cp2.icon = cp.icon')
                , 'total');

            const result = await qb
                .groupBy('cp.icon')
                .getRawMany();

            const returned: any = {
                total: 0,
            };

            for (const i in result) {
                const row = result[i];
                const total = parseInt(row.total);

                returned[row.icon] = total;
                returned.total += total;
            }

            resolve(returned);
        });
    }

    /**
     * Create new Career Path
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: CareerPathCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CareerPathEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Career Path
            const CareerPath = new CareerPathEntity();

            // Get uploaded file
            const { file, fileName, ...rest } = data;

            if (file) {
                CareerPath.file = await this._uploadService.saveFromGraphqlUpload(file, null, upl => {
                    if (fileName) upl.name = fileName;
                }, null, null, transaction);
            }

            // Set Data
            Object.assign(CareerPath, rest);

            // Save hit
            const result = await transaction.save(CareerPath);

            if (result) {
                this._logger.create(CareerPath);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Career Path
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: CareerPathUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<CareerPathEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, file, fileName, ...req } = data;

            // Find existing
            const oldCareerPath = await this.findOne(id, repo, transaction);

            if (oldCareerPath) {
                // Set old data
                this._logger.setOldData(oldCareerPath);

                if (file) {
                    oldCareerPath.file = await this._uploadService.saveFromGraphqlUpload(file, null, upl => {
                        if (fileName) upl.name = fileName;
                    }, oldCareerPath.file, null, transaction);
                }

                // Add new Data
                Object.assign(oldCareerPath, req);

                // Save it
                const result = await transaction.save(oldCareerPath);

                if (result) {
                    this._logger.update(oldCareerPath);

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
        req: CareerPathRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof CareerPathEntity ? id.id : id;
                const CareerPath = await this.findOne(id, repo, transaction);

                if (CareerPath instanceof CareerPathEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(CareerPathEntity, CareerPath.id);

                        if (CareerPath.file) {
                            const result = await this._uploadService.remove({
                                id: CareerPath.file,
                                type: REMOVE_TYPES.HARD,
                            }, null, transaction);
                        }

                        this._logger.delete(CareerPath);
                    } else {
                        await transaction.softDelete(CareerPathEntity, CareerPath.id);

                        this._logger.softDelete(CareerPath);
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
    ): SelectQueryBuilder<CareerPathEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('cp', manager?.queryRunner)
            .leftJoinAndSelect('cp.file', 'fi')
            .leftJoinAndSelect('cp.employee', 'emp')
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
        qb: SelectQueryBuilder<CareerPathEntity>,
        filter?: CareerPathFilterArgInput,
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

            if (filter.titles?.length) qb.andWhere(`${this._cn('titles')} IN (:...titles)`, { titles: filter.titles });

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });

            if (filter.icon) qb.andWhere(`${this._cn('icon')}::text = :icon`, { icon: `%${filter.icon}%` });

            if (filter.icons?.length) qb.andWhere(`${this._cn('icon')} IN (:...icons)`, { icons: filter.icons });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<CareerPathEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return CareerPathService.ColumnQueryNames.get(columnName);
    }

}
