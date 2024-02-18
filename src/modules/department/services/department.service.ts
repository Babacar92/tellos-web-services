import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { DepartmentEntity } from '../../../entities/psql/DepartmentEntity';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from '../../../libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from '../../../libs/services/abstract.repository.service';
import { DepartmentCreateArgInput } from '../dto/args/department.create.arg.input';
import { DepartmentFilterArgInput } from '../dto/args/department.filter.arg.input';
import { DepartmentRemoveArgInput } from '../dto/args/department.remove.arg.input';
import { DepartmentUpdateArgInput } from '../dto/args/department.update.arg.input';
import { DepartmentPaginationResultInterface } from '../dto/interfaces/department.pagination.result.interface';
import { DEPARTMENT_PROVIDERS_NAMES } from '../dto/provider/department.providers';
import { DepartmentLogger } from '../logger/department.logger';

@Injectable()
export class DepartmentService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'd.id'],
        ['name', 'd.name'],
        ['active', 'd.active'],
        ['createdAt', 'd.createdAt'],
        ['updatedAt', 'd.updatedAt'],
        ['deletedAt', 'd.deletedAt'],
        ['createdBy', 'd.createdBy'],
        ['updatedBy', 'd.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(DEPARTMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<DepartmentEntity>,
        private readonly _logger: DepartmentLogger,
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
        id?: number | DepartmentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof DepartmentEntity) id = id.id;

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
        id?: number | DepartmentEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof DepartmentEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('d', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (DepartmentEntity.isColumnString(column)) {
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
        filter: DepartmentFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DepartmentEntity[]> {
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
    public async findDepartmentAndPaginationAll(
        filter: DepartmentFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DepartmentPaginationResultInterface> {
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
        id: number | DepartmentEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DepartmentEntity> {
        if (id instanceof DepartmentEntity) id = id.id;
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
    ): Promise<DepartmentEntity> {
        const qb = this._initSelect(repo, manager);

        if (DepartmentEntity.isColumnString(column)) {
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
        data: DepartmentCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DepartmentEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const department = new DepartmentEntity();

            // Set Data
            Object.assign(department, data);

            // Save hit
            const result = await transaction.save(department);

            if (result) {
                this._logger.create(department);

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
        data: DepartmentUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<DepartmentEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldDepartment = await this.findOne(id, repo, transaction);

            if (oldDepartment) {
                // Set old data
                this._logger.setOldData(oldDepartment);

                // Add new Data
                Object.assign(oldDepartment, req);

                // Save Data
                const result = await transaction.save(oldDepartment);

                if (result) {
                    this._logger.update(oldDepartment);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing department
     * @param updateDepartment 
     * @param repo 
     * @returns
     */
    public async remove(
        req: DepartmentRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof DepartmentEntity ? id.id : id;
                const department = await this.findOne(id, repo, transaction);

                if (department instanceof DepartmentEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(DepartmentEntity, department.id);

                        this._logger.delete(department);
                    } else {
                        await transaction.softDelete(DepartmentEntity, department.id);

                        this._logger.softDelete(department);
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
    ): SelectQueryBuilder<DepartmentEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('d', manager?.queryRunner)
            .leftJoinAndSelect('d.employees', 'e');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<DepartmentEntity>,
        filter?: DepartmentFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`${this._cn('name')} ILIKE :search`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.name) qb.andWhere(`${this._cn('name')} ILIKE :name`, { name: `%${filter.name}%` });

            if (filter.names?.length) qb.andWhere(`${this._cn('name')} IN (:...names)`, { names: filter.names });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<DepartmentEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return DepartmentService.ColumnQueryNames.get(columnName);
    }

}
