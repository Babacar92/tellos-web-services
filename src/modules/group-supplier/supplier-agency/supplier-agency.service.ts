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
import { SupplierAgency } from '@Entities/supplier-agency.entity';

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
import { SupplierAgencyCreateInput } from './dto/inputs/supplier-agency.create.input';
import { SupplierAgencyRemoveInput } from './dto/inputs/supplier-agency.remove.input';
import { SupplierAgencyUpdateInput } from './dto/inputs/supplier-agency.update.input';
// ---- Args
import { SupplierAgencyFilterArgs } from './dto/args/supplier-agency.filter.args';

// Logger
import { SupplierAgencyLogger } from './logger/supplier-agency.logger';

// Services
// Enums

enum DatabaseAliasEnum {
    SUPPLIER_AGENCY = 'sa',
    SUPPLIER = 's',
}

@Injectable()
export class SupplierAgencyService {
    private repository: Repository<SupplierAgency>;

    private baseColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.id`],
        ['ids', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.id`],
        ['supplierId', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.supplierId`],
        ['name', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.name`],
        ['address', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.address`],
        ['addressBis', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.addressBis`],
        ['postcode', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.postcode`],
        ['city', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.city`],
        ['country', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.country`],
        ['phone', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.phone`],
        ['fax', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.fax`],
        ['active', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.active`],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER_AGENCY}.updatedBy`],
    ]);
    /**
     * The column name for search
     */
    private columnQueryNames = new Map([
        ...this.baseColumnQueryNames,
        ['supplier', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['supplier.name', `${DatabaseAliasEnum.SUPPLIER}.name`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: SupplierAgencyLogger,
    ) {
        this.repository = this.dataSource.getRepository(SupplierAgency);
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
                `${DatabaseAliasEnum.SUPPLIER_AGENCY}`,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this.baseColumnQueryNames.get('id')}) AS total`);

            if (SupplierAgency.isColumnString(column)) {
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
        filter: SupplierAgencyFilterArgs,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<SupplierAgency>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.repository.createQueryBuilder(
                `${DatabaseAliasEnum.SUPPLIER_AGENCY}`,
            );

            addFilters<SupplierAgency, SupplierAgencyFilterArgs>(
                queryBuilder,
                filter,
                this.columnQueryNames,
            );

            addSearch<SupplierAgency>(
                queryBuilder,
                this.columnQueryNames,
                ['name', 'phone', 'fax'],
                filter.search,
            );

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            addSorting<SupplierAgency>(
                queryBuilder,
                sort,
                this.columnQueryNames,
            );

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<SupplierAgency>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async findOne(id: number): Promise<SupplierAgency> {
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
        data: SupplierAgencyCreateInput,
    ): Promise<SupplierAgency> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;

            // Init new Entity Quick Access
            const supplierAgency = new SupplierAgency();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(supplierAgency, rest);

            // Save hit
            const result = await transaction
                .getRepository(SupplierAgency)
                .save(supplierAgency);
            await queryRunner.commitTransaction();

            if (result) {
                this._logger.create(supplierAgency);

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
        data: SupplierAgencyUpdateInput,
    ): Promise<SupplierAgency> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldSupplierAgency = await this.findOne(id);

            if (oldSupplierAgency) {
                // Set old data
                this._logger.setOldData(oldSupplierAgency);

                // Add new Data
                Object.assign(oldSupplierAgency, req);

                // Save Data
                const result = await transaction.save(oldSupplierAgency);

                await queryRunner.commitTransaction();
                if (result) {
                    this._logger.update(oldSupplierAgency);
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
    public async remove(req: SupplierAgencyRemoveInput): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            if (req && req.id && req.type) {
                const { id, type } = req;
                const supplierAgency = await this.findOne(id);
                if (supplierAgency instanceof SupplierAgency) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            SupplierAgency,
                            supplierAgency.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.delete(supplierAgency);
                    } else {
                        await transaction.softDelete(
                            SupplierAgency,
                            supplierAgency.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.softDelete(supplierAgency);
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
