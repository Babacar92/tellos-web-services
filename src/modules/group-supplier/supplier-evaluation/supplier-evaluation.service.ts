// NestJS
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

// TypeORM
import { DataSource, Repository } from 'typeorm';

// Schemas
import { SupplierEvaluation } from '@Entities/supplier-evaluation.entity';

// Database
import { PSQL_DB_CONN_NAME } from '@/datasource-config';
import { REMOVE_TYPES } from '@Libs/databases/dto/types/databases.type';
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import {
    addFilters,
    addSearch,
    addSorting,
} from '@Libs/databases/utils/db.utils';
import { PaginatedResult } from '@Libs/databases/dto/interfaces/result.pagination.interface';

// DTOs
// ---- Input
import { SupplierEvaluationCreateInput } from './dto/inputs/supplier-evaluation.create.input';
import { SupplierEvaluationRemoveInput } from './dto/inputs/supplier-evaluation.remove.input';
import { SupplierEvaluationUpdateInput } from './dto/inputs/supplier-evaluation.update.input';
// ---- Args
import { SupplierEvaluationFilterArgs } from './dto/args/supplier-evaluation.filter.args';

// Logger
import { SupplierEvaluationLogger } from './logger/supplier-evaluation.logger';

// Services
// Enums

enum DatabaseAliasEnum {
    SUPPLIER_EVALUATION = 'se',
    SUPPLIER = 's',
    EMPLOYEE = 'e',
    LOGIN = 'l',
}

@Injectable()
export class SupplierEvaluationService {
    private repository: Repository<SupplierEvaluation>;

    private baseColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.id`],
        ['note', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.note`],
        ['notes', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.note`],
        ['startDate', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.createdAt`],
        ['endDate', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.createdAt`],
        ['comment', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.comment`],
        ['active', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.active`],
        [
            'formattedCreatedAt',
            `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.createdAt`,
        ],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.createdBy`],

        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.updatedBy`],
    ]);
    /**
     * The column name for search
     */
    private columnQueryNames = new Map([
        ...this.baseColumnQueryNames,
        ['employee', `${DatabaseAliasEnum.EMPLOYEE}.id`],
        ['login', `${DatabaseAliasEnum.LOGIN}.id`],
        ['supplierId', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['supplier.name', `${DatabaseAliasEnum.SUPPLIER}.name`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: SupplierEvaluationLogger,
    ) {
        this.repository = this.dataSource.getRepository(SupplierEvaluation);
    }

    public async exist(id: number, withDeleted?: boolean): Promise<boolean> {
        return this.existByColumn(id, 'id', null, withDeleted);
    }

    public async existByColumn(
        value: any,
        column: string,
        id?: number,
        withDeleted?: boolean,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            const qb = this.repository.createQueryBuilder(
                `${DatabaseAliasEnum.SUPPLIER_EVALUATION}`,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this.baseColumnQueryNames.get('id')}) AS total`);

            if (SupplierEvaluation.isColumnString(column)) {
                qb.andWhere(
                    `${this.baseColumnQueryNames.get(
                        column,
                    )} ILIKE :column_value`,
                    { column_value: value },
                );
            } else {
                qb.andWhere(
                    `${this.baseColumnQueryNames.get(column)} = :column_value`,
                    { column_value: value },
                );
            }

            if (id > 0 && column !== 'id')
                qb.andWhere(
                    `${this.baseColumnQueryNames.get('id')} != :column_id`,
                    { column_id: id },
                );

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    public async findAll(
        filter: SupplierEvaluationFilterArgs,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<SupplierEvaluation>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.repository
                .createQueryBuilder(`${DatabaseAliasEnum.SUPPLIER_EVALUATION}`)
                .select()
                .leftJoinAndSelect(
                    `${DatabaseAliasEnum.SUPPLIER_EVALUATION}.supplier`,
                    's',
                );

            const { startDate, endDate, ...otherFilters } = filter;

            addFilters<SupplierEvaluation, SupplierEvaluationFilterArgs>(
                queryBuilder,
                otherFilters,
                this.columnQueryNames,
            );
            if (startDate || endDate) {
                if (startDate) {
                    startDate.setHours(0);
                    startDate.setMinutes(0);
                    startDate.setSeconds(0);
                    queryBuilder.andWhere('se.createdAt >= :startDate', {
                        startDate: startDate,
                    });
                }
                if (endDate) {
                    endDate.setHours(23);
                    endDate.setMinutes(59);
                    endDate.setSeconds(59);
                    queryBuilder.andWhere('se.createdAt <= :endDate', {
                        endDate: endDate,
                    });
                }
            }

            addSearch<SupplierEvaluation>(
                queryBuilder,
                this.columnQueryNames,
                ['denomination'],
                filter.search,
            );

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            addSorting<SupplierEvaluation>(
                queryBuilder,
                sort,
                this.columnQueryNames,
            );

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<SupplierEvaluation>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async findOne(id: number): Promise<SupplierEvaluation> {
        try {
            return this.repository.findOneBy({ id });
        } catch (e) {
            throw new NotFoundException();
        }
    }

    /**
     * Create new Quick Access
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: SupplierEvaluationCreateInput,
    ): Promise<SupplierEvaluation> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;

            // Init new Entity Quick Access
            const supplierEvaluation = new SupplierEvaluation();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(supplierEvaluation, rest);

            // Save hit
            const result = await transaction
                .getRepository(SupplierEvaluation)
                .save(supplierEvaluation);
            await queryRunner.commitTransaction();

            if (result) {
                this._logger.create(supplierEvaluation);

                return this.findOne(result.id);
            }
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Update new Quick Access
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: SupplierEvaluationUpdateInput,
    ): Promise<SupplierEvaluation> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldSupplierEvaluation = await this.findOne(id);

            if (oldSupplierEvaluation) {
                // Set old data
                this._logger.setOldData(oldSupplierEvaluation);

                // Add new Data
                Object.assign(oldSupplierEvaluation, req);

                // Save Data
                const result = await transaction.save(oldSupplierEvaluation);

                await queryRunner.commitTransaction();
                if (result) {
                    this._logger.update(oldSupplierEvaluation);
                    return this.findOne(id);
                }
            }
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Update an existing entity
     * @param updateEntity
     * @param repo
     * @returns
     */
    public async remove(req: SupplierEvaluationRemoveInput): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            if (req && req.id && req.type) {
                const { id, type } = req;
                const supplierEvaluation = await this.findOne(id);
                if (supplierEvaluation instanceof SupplierEvaluation) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            SupplierEvaluation,
                            supplierEvaluation.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.delete(supplierEvaluation);
                    } else {
                        await transaction.softDelete(
                            SupplierEvaluation,
                            supplierEvaluation.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.softDelete(supplierEvaluation);
                    }
                    return true;
                } else return false;
            } else return false;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
}
