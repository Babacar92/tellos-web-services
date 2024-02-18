// NestJS
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

// TypeORM
import { DataSource, In, Repository } from 'typeorm';

// Schemas
import { Supplier } from '@Entities/supplier.entity';

// Database
import { PSQL_DB_CONN_NAME } from '@/datasource-config';
import { REMOVE_TYPES } from '@Libs/databases/dto/types/databases.type';
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import { addFilters, addSearch, addSorting } from '@Libs/databases/utils/db.utils';
import { PaginatedResult } from '@Libs/databases/dto/interfaces/result.pagination.interface';

// DTOs
// ---- Input 
import { SupplierCreateInput } from './dto/inputs/supplier.create.input';
import { SupplierRemoveInput } from './dto/inputs/supplier.remove.input';
import { SupplierUpdateInput } from './dto/inputs/supplier.update.input';
// ---- Args
import { SupplierFilterArgs } from './dto/args/supplier.filter.args';

// Logger
import { SupplierLogger } from './logger/supplier.logger';
import { SupplierBilling } from '@/entities/psql/supplier-billing.entity';

// Services
// Enums

enum DatabaseAliasEnum {
    SUPPLIER = 's',
    SUPPLIER_LANGUAGE_CODE = 'slc',
    SUPPLIER_CATEGORY = 'sc'
}

@Injectable()
export class SupplierService {

    private repository: Repository<Supplier>;

    private baseColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['ids', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['name', `${DatabaseAliasEnum.SUPPLIER}.name`],
        ['address', `${DatabaseAliasEnum.SUPPLIER}.address`],
        ['addressBis', `${DatabaseAliasEnum.SUPPLIER}.addressBis`],
        ['city', `${DatabaseAliasEnum.SUPPLIER}.city`],
        ['zipCode', `${DatabaseAliasEnum.SUPPLIER}.zipCode`],
        ['country', `${DatabaseAliasEnum.SUPPLIER}.country`],
        ['observation', `${DatabaseAliasEnum.SUPPLIER}.observation`],
        ['phone', `${DatabaseAliasEnum.SUPPLIER}.phone`],
        ['email', `${DatabaseAliasEnum.SUPPLIER}.email`],
        ['website', `${DatabaseAliasEnum.SUPPLIER}.website`],
        ['fax', `${DatabaseAliasEnum.SUPPLIER}.fax`],
        ['siret', `${DatabaseAliasEnum.SUPPLIER}.siret`],
        ['ape', `${DatabaseAliasEnum.SUPPLIER}.ape`],
        ['vat', `${DatabaseAliasEnum.SUPPLIER}.vat`],
        ['authorizedOutStanding', `${DatabaseAliasEnum.SUPPLIER}.authorizedOutStanding`],
        ['clientName', `${DatabaseAliasEnum.SUPPLIER}.clientName`],
        ['active', `${DatabaseAliasEnum.SUPPLIER}.active`],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER}.updatedBy`],
    ]);
    /**
     * The column name for search
     */
    private columnQueryNames = new Map([
        ...this.baseColumnQueryNames,
        ['languageCodes', `${DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE}.id`],
        ['categories', `${DatabaseAliasEnum.SUPPLIER_CATEGORY}.id`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: SupplierLogger,
    ) {
        this.repository = this.dataSource.getRepository(Supplier);
    }

    public async findSuppliersByIds(
        ids: number[],
    ): Promise<Supplier[] | Error> {
        const data = await this.dataSource.getRepository(Supplier).find({ where: { id: In(ids) } });
        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
    }

    public async exist(id: number, withDeleted?: boolean,): Promise<boolean> {
        return this.existByColumn(id, "id", null, withDeleted);
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

            const qb = this.repository.createQueryBuilder(`${DatabaseAliasEnum.SUPPLIER}`);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this.baseColumnQueryNames.get('id')}) AS total`);

            if (Supplier.isColumnString(column)) {
                qb.andWhere(`${this.baseColumnQueryNames.get(column)} ILIKE :column_value`, { column_value: value });
            } else {
                qb.andWhere(`${this.baseColumnQueryNames.get(column)} = :column_value`, { column_value: value });
            }

            if (id > 0 && column !== "id") qb.andWhere(`${this.baseColumnQueryNames.get('id')} != :column_id`, { column_id: id });

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    public async findAll(
        filter: SupplierFilterArgs,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<Supplier>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.repository
                .createQueryBuilder(`${DatabaseAliasEnum.SUPPLIER}`);


            if(filter && (filter.languageCodes || filter.languageCode)){
                queryBuilder.leftJoinAndSelect(`${DatabaseAliasEnum.SUPPLIER}.languageCode`, DatabaseAliasEnum.SUPPLIER_LANGUAGE_CODE)
            }

            if(filter && (filter.categories ||filter.category)){
                queryBuilder.leftJoinAndSelect(`${DatabaseAliasEnum.SUPPLIER}.category`, DatabaseAliasEnum.SUPPLIER_CATEGORY)
            }

            addFilters<Supplier, SupplierFilterArgs>(queryBuilder, filter, this.columnQueryNames);
            addSearch<Supplier>(queryBuilder, this.columnQueryNames, ['vat', 'ape', 'siret', 'name'], filter.search);

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            addSorting<Supplier>( queryBuilder, sort, this.columnQueryNames );

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<Supplier>(results, count, pagination);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async findOne(id: number): Promise<Supplier> {
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
        data: SupplierCreateInput,
    ): Promise<Supplier> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{

            const transaction = queryRunner.manager;

            // Init new Entity Quick Access
            const supplier = new Supplier();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(supplier, rest);

            // Save hit
            const createdSupplier = await transaction.getRepository(Supplier).save(supplier);

            await transaction
                .getRepository(SupplierBilling)
                .save(
                    new SupplierBilling({
                        supplier: createdSupplier
                    })
                );

            await queryRunner.commitTransaction();

            if (createdSupplier) {
                this._logger.create(supplier);

                return this.findOne(createdSupplier.id);
            }
        } catch(e) {
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
        data: SupplierUpdateInput,
    ): Promise<Supplier> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const transaction = queryRunner.manager;
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldSupplier = await this.findOne(id);


            if (oldSupplier) {
                // Set old data
                this._logger.setOldData(oldSupplier);

                // Add new Data
                Object.assign(oldSupplier, req);

                // Save Data
                const result = await transaction.save(oldSupplier);
                
                await queryRunner.commitTransaction();
                if (result) {
                    this._logger.update(oldSupplier);
                    return this.findOne(id);
                }
            }
        } catch(e) {
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
    public async remove(req: SupplierRemoveInput): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const transaction = queryRunner.manager;
            if (req && req.id && req.type) {
                let { id, type } = req;
                const supplier = await this.findOne(id);
                if (supplier instanceof Supplier) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(Supplier, supplier.id);
                        await queryRunner.commitTransaction();
                        this._logger.delete(supplier);
                    } else {
                        await transaction.softDelete(Supplier, supplier.id);
                        await queryRunner.commitTransaction();
                        this._logger.softDelete(supplier);
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
