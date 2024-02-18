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
import { SupplierBilling } from '@Entities/supplier-billing.entity';

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
import { SupplierBillingCreateInput } from './dto/inputs/supplier-billing.create.input';
import { SupplierBillingRemoveInput } from './dto/inputs/supplier-billing.remove.input';
import { SupplierBillingUpdateInput } from './dto/inputs/supplier-billing.update.input';
// ---- Args
import { SupplierBillingFilterArgs } from './dto/args/supplier-billing.filter.args';

// Logger
import { SupplierBillingLogger } from './logger/suplier-billing.logger';

// Services
// Enums

enum DatabaseAliasEnum {
    SUPPLIER_BILLING = 'se',
    SUPPLIER = 's',
    LOGIN = 'l',
}

@Injectable()
export class SupplierBillingService {
    private repository: Repository<SupplierBilling>;

    private baseColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER_BILLING}.id`],
        ['supplier', `${DatabaseAliasEnum.SUPPLIER_BILLING}.supplier`],
        ['taxCode', `${DatabaseAliasEnum.SUPPLIER_BILLING}.taxCode`],
        [
            'regulationCode',
            `${DatabaseAliasEnum.SUPPLIER_BILLING}.regulationCode`,
        ],
        ['currency', `${DatabaseAliasEnum.SUPPLIER_BILLING}.currency`],
        ['rib', `${DatabaseAliasEnum.SUPPLIER_BILLING}.rib`],
        [
            'billingAddress',
            `${DatabaseAliasEnum.SUPPLIER_BILLING}.billingAddress`,
        ],
        ['iban', `${DatabaseAliasEnum.SUPPLIER_BILLING}.iban`],
        ['bic', `${DatabaseAliasEnum.SUPPLIER_BILLING}.bic`],
        ['discountRate', `${DatabaseAliasEnum.SUPPLIER_BILLING}.discountRate`],
        ['bankRate', `${DatabaseAliasEnum.SUPPLIER_BILLING}.bankRate`],
        ['minOrder', `${DatabaseAliasEnum.SUPPLIER_BILLING}.minOrder`],
        ['conditions', `${DatabaseAliasEnum.SUPPLIER_BILLING}.conditions`],
        ['deliveryMode', `${DatabaseAliasEnum.SUPPLIER_BILLING}.deliveryMode`],
        [
            'creditInsurer',
            `${DatabaseAliasEnum.SUPPLIER_BILLING}.creditInsurer`,
        ],
        ['insurerName', `${DatabaseAliasEnum.SUPPLIER_BILLING}.insurerName`],
        ['intraGroup', `${DatabaseAliasEnum.SUPPLIER_BILLING}.intraGroup`],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER_BILLING}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER_BILLING}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER_BILLING}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER_BILLING}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER_BILLING}.updatedBy`],
    ]);
    /**
     * The column name for search
     */
    private columnQueryNames = new Map([
        ...this.baseColumnQueryNames,
        ['login', `${DatabaseAliasEnum.LOGIN}.id`],
        ['supplier', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['supplier.name', `${DatabaseAliasEnum.SUPPLIER}.name`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: SupplierBillingLogger,
    ) {
        this.repository = this.dataSource.getRepository(SupplierBilling);
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
                `${DatabaseAliasEnum.SUPPLIER_BILLING}`,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this.baseColumnQueryNames.get('id')}) AS total`);

            if (SupplierBilling.isColumnString(column)) {
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
        filter: SupplierBillingFilterArgs,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<SupplierBilling>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.repository.createQueryBuilder(
                `${DatabaseAliasEnum.SUPPLIER_BILLING}`,
            );

            const { ...otherFilters } = filter;

            addFilters<SupplierBilling, SupplierBillingFilterArgs>(
                queryBuilder,
                otherFilters,
                this.columnQueryNames,
            );

            addSearch<SupplierBilling>(
                queryBuilder,
                this.columnQueryNames,
                ['denomination'],
                filter.search,
            );

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            addSorting<SupplierBilling>(
                queryBuilder,
                sort,
                this.columnQueryNames,
            );

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<SupplierBilling>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async findOne(id: number): Promise<SupplierBilling> {
        try {
            return this.repository.findOneBy({ id });
        } catch (e) {
            throw new NotFoundException();
        }
    }

    async findOneSupplierBillingBySupplierId(supplierId: number): Promise<SupplierBilling> {
        try{
            return this.dataSource.getRepository(SupplierBilling).findOne({
                where: { supplier_id: supplierId },
            });
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
        data: SupplierBillingCreateInput,
    ): Promise<SupplierBilling> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;

            // Init new Entity Quick Access
            const supplierBilling = new SupplierBilling();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(supplierBilling, rest);

            // Save hit
            const result = await transaction
                .getRepository(SupplierBilling)
                .save(supplierBilling);
            await queryRunner.commitTransaction();

            if (result) {
                this._logger.create(supplierBilling);

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
        data: SupplierBillingUpdateInput,
    ): Promise<SupplierBilling> {
        console.log("one st ici");
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldSupplierBilling = await this.findOne(id);

            if (oldSupplierBilling) {
                // Set old data
                this._logger.setOldData(oldSupplierBilling);

                // Add new Data
                Object.assign(oldSupplierBilling, req);

                // Save Data
                const result = await transaction.save(oldSupplierBilling);

                await queryRunner.commitTransaction();
                if (result) {
                    this._logger.update(oldSupplierBilling);
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
    public async remove(req: SupplierBillingRemoveInput): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            if (req && req.id && req.type) {
                const { id, type } = req;
                const supplierBilling = await this.findOne(id);
                if (supplierBilling instanceof SupplierBilling) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(
                            SupplierBilling,
                            supplierBilling.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.delete(supplierBilling);
                    } else {
                        await transaction.softDelete(
                            SupplierBilling,
                            supplierBilling.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.softDelete(supplierBilling);
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
