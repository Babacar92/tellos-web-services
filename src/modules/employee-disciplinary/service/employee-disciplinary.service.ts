import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import {
    Brackets,
    EntityManager,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { EmployeeDisciplinaryCreateArgInput } from '../dto/args/employee-disciplinary.create.arg.input';
import { EmployeeDisciplinaryFilterArgInput } from '../dto/args/employee-disciplinary.filter.arg.input';
import { EmployeeDisciplinaryRemoveArgInput } from '../dto/args/employee-disciplinary.remove.arg.input';
import { EmployeeDisciplinaryUpdateArgInput } from '../dto/args/employee-disciplinary.update.arg.input';
import { EmployeeDisciplinaryPaginationResultInterface } from '../dto/interfaces/employee-disciplinary.pagination.result.interface';
import { EMPLOYEE_DISCIPLINARY_PROVIDERS_NAMES } from '../dto/provider/employee-disciplinary.providers';
import { EmployeeDisciplinaryEntity } from 'src/entities/psql/EmployeeDisciplinaryEntity';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { EmployeeDisciplinaryLogger } from '../logger/employee-disciplinary.logger';

@Injectable()
export class EmployeeDisciplinaryService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'ed.id'],
        ['comment', 'ed.comment'],
        ['employeeId', 'emp.id'],
        ['employee', 'emp.id'],
        ['employee.firstname', 'emp.firstname'],
        ['employee.lastname', 'emp.lastname'],
        ['file', 'fi.id'],
        ['active', 'ed.active'],
        ['createdAt', 'ed.createdAt'],
        ['updatedAt', 'ed.updatedAt'],
        ['deletedAt', 'ed.deletedAt'],
        ['createdBy', 'ed.createdBy'],
        ['updatedBy', 'ed.updatedBy'],
    ]);

    /**
     * Constructor of EmployeeDisciplinary service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(EMPLOYEE_DISCIPLINARY_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<EmployeeDisciplinaryEntity>,
        private readonly _logger: EmployeeDisciplinaryLogger,
        private readonly _uploadService: UploadService,
    ) {
        super();
    }

    /**
     * Check if EmployeeDisciplinary Exist
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async exist(
        id?: number | EmployeeDisciplinaryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EmployeeDisciplinaryEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
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
        id?: number | EmployeeDisciplinaryEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof EmployeeDisciplinaryEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('ed', manager?.queryRunner)
                .leftJoin('ed.files', 'fi');

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (EmployeeDisciplinaryEntity.isColumnString(column)) {
                if (
                    column === 'fileName' &&
                    !UploadService.isValidFilename(value)
                ) {
                    value = UploadService.renameFilename(value);
                }
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, {
                    column_value: value,
                });
            }

            if (id > 0 && column !== 'id')
                qb.andWhere(`${this._cn('id')} != :column_id`, {
                    column_id: id,
                });

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    /**
     * Return all EmployeeDisciplinary
     * @param repo
     * @returns
     */
    public async findAll(
        filter?: EmployeeDisciplinaryFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EmployeeDisciplinaryEntity[]> {
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
    public async findEmployeeDisciplinaryAndPaginationAll(
        filter: EmployeeDisciplinaryFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EmployeeDisciplinaryPaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

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
        id: number | EmployeeDisciplinaryEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EmployeeDisciplinaryEntity> {
        if (id instanceof EmployeeDisciplinaryEntity) id = id.id;
        return this.findByColumn('id', id, repo, manager);
    }

    /**
     * Return an existing EmployeeDisciplinary by his column value
     * @param column
     * @param value
     * @param repo
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EmployeeDisciplinaryEntity> {
        const qb = this._initSelect(repo, manager);

        if (EmployeeDisciplinaryEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                column_value: value,
            });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, {
                column_value: value,
            });
        }

        return qb.getOne();
    }

    /**
     * Create new CEmployeeDisciplinary
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: EmployeeDisciplinaryCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EmployeeDisciplinaryEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Career Path
            const EmployeeDisciplinary = new EmployeeDisciplinaryEntity();

            // Get uploaded file
            const { files, ...rest } = data;

            if (files) {
                EmployeeDisciplinary.files =
                    await this._uploadService.saveFromGraphqlUploadMultiple(
                        files,
                        null,
                        null,
                        null,
                        transaction,
                    );
            }

            // Set Data
            Object.assign(EmployeeDisciplinary, rest);

            // Save hit
            const result = await transaction.save(EmployeeDisciplinary);

            if (result) {
                this._logger.create(EmployeeDisciplinary);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update new Career Path
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: EmployeeDisciplinaryUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EmployeeDisciplinaryEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, files, ...req } = data;

            // Find existing
            const oldEmployeeDisciplinary = await this.findOne(
                id,
                repo,
                transaction,
            );

            if (oldEmployeeDisciplinary) {
                // Set old data
                this._logger.setOldData(oldEmployeeDisciplinary);

                // Add new Data
                Object.assign(oldEmployeeDisciplinary, req);

                if (files?.length) {
                    const oldfiles = oldEmployeeDisciplinary.files || [];

                    if (oldfiles.length) {
                        for (const i in oldfiles) {
                            const file = oldfiles[i];

                            await this._uploadService.remove(
                                {
                                    id: file,
                                    type: REMOVE_TYPES.HARD,
                                },
                                null,
                                transaction,
                            );
                        }
                    }

                    oldEmployeeDisciplinary.files =
                        await this._uploadService.saveFromGraphqlUploadMultiple(
                            files,
                            null,
                            null,
                            null,
                            transaction,
                        );
                } else delete oldEmployeeDisciplinary.files;

                // Save it
                const result = await transaction.save(oldEmployeeDisciplinary);

                if (result) {
                    this._logger.update(oldEmployeeDisciplinary);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, manager || repo);
    }

    /**
     * Update an existing entity
     * @param updateEntity
     * @param repo
     * @returns
     */
    public async remove(
        req: EmployeeDisciplinaryRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof EmployeeDisciplinaryEntity ? id.id : id;
                const EmployeeDisciplinary = await this.findOne(
                    id,
                    repo,
                    transaction,
                );

                if (
                    EmployeeDisciplinary instanceof EmployeeDisciplinaryEntity
                ) {
                    if (type === REMOVE_TYPES.HARD) {
                        for (const k in EmployeeDisciplinary.files || []) {
                            const file = EmployeeDisciplinary.files[k];

                            await this._uploadService.remove(
                                {
                                    id: file,
                                    type: REMOVE_TYPES.HARD,
                                },
                                null,
                                transaction,
                            );
                        }

                        await transaction.delete(
                            EmployeeDisciplinaryEntity,
                            EmployeeDisciplinary.id,
                        );

                        this._logger.delete(EmployeeDisciplinary);
                    } else {
                        await transaction.softDelete(
                            EmployeeDisciplinaryEntity,
                            EmployeeDisciplinary.id,
                        );

                        this._logger.softDelete(EmployeeDisciplinary);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, manager || repo);
    }

    /**
     * Init Select Query Builder
     * @param repo
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<EmployeeDisciplinaryEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('ed', manager?.queryRunner)
            .leftJoinAndSelect('ed.files', 'fi')
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
        qb: SelectQueryBuilder<EmployeeDisciplinaryEntity>,
        filter?: EmployeeDisciplinaryFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }

            if (filter.employeeId)
                qb.andWhere(`${this._cn('employeeId')} = :employeeId`, {
                    employeeId: filter.employeeId,
                });

            if (filter.employeeIds?.length)
                qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, {
                    employeeIds: filter.employeeIds,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<EmployeeDisciplinaryEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return EmployeeDisciplinaryService.ColumnQueryNames.get(columnName);
    }
}
