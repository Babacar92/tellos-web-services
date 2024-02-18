// NestJS
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

// TypeORM
import { DataSource, Repository } from 'typeorm';

// Schemas
import { SupplierContact } from '@Entities/supplier-contact.entity';

// Database
import { PSQL_DB_CONN_NAME } from '@/datasource-config';
import { REMOVE_TYPES } from '@Libs/databases/dto/types/databases.type';
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import { addFilters, addSearch, addSorting } from '@Libs/databases/utils/db.utils';
import { PaginatedResult } from '@Libs/databases/dto/interfaces/result.pagination.interface';

// DTOs
// ---- Input 
import { SupplierContactCreateInput } from './dto/inputs/supplier-contact.create.input';
import { SupplierContactRemoveInput } from './dto/inputs/supplier-contact.remove.input';
import { SupplierContactUpdateInput } from './dto/inputs/supplier-contact.update.input';
// ---- Args
import { SupplierContactFilterArgs } from './dto/args/supplier-contact.filter.args';

// Logger
import { SupplierContactLogger } from './logger/supplier-contact.logger';

// Services
// Enums

enum DatabaseAliasEnum {
    SUPPLIER_CONTACT = 'sc',
    SUPPLIER = 's',
}

@Injectable()
export class SupplierContactService {
    private repository: Repository<SupplierContact>;

    private baseColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.id`],
        ['name', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.name`],
        ['service', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.service`],
        ['phone', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.phone`],
        ['mobilePhone', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.mobilePhone`],
        ['email', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.email`],
        ['active', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.active`],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER_CONTACT}.updatedBy`],
    ])
    /**
     * The column name for search
     */
    private columnQueryNames = new Map([
        ...this.baseColumnQueryNames,
        ['supplier', `${DatabaseAliasEnum.SUPPLIER}.id`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _logger: SupplierContactLogger,
    ) {
        this.repository = this.dataSource.getRepository(SupplierContact);
    }

    public async findAll(
        filter: SupplierContactFilterArgs,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<SupplierContact>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.repository
                .createQueryBuilder(`${DatabaseAliasEnum.SUPPLIER_CONTACT}`);

            if(filter && (filter.supplier)){
                queryBuilder.leftJoinAndSelect(`${DatabaseAliasEnum.SUPPLIER_CONTACT}.supplier`, DatabaseAliasEnum.SUPPLIER)
            }

            addFilters<SupplierContact, SupplierContactFilterArgs>(queryBuilder, filter, this.columnQueryNames);
            addSearch<SupplierContact>(queryBuilder, this.columnQueryNames, ['denomination'], filter.search);

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            addSorting<SupplierContact>( queryBuilder, sort, this.columnQueryNames );

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<SupplierContact>(results, count, pagination);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async findOne(id: number): Promise<SupplierContact> {
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
        data: SupplierContactCreateInput,
    ): Promise<SupplierContact> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{

            const transaction = queryRunner.manager;

            // Init new Entity Quick Access
            const supplierContact = new SupplierContact();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(supplierContact, rest);

            // Save hit
            const result = await transaction.getRepository(SupplierContact).save(supplierContact);
            await queryRunner.commitTransaction();

            if (result) {
                this._logger.create(supplierContact);

                return this.findOne(result.id);
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
        data: SupplierContactUpdateInput,
    ): Promise<SupplierContact> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const transaction = queryRunner.manager;
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldSupplierContact = await this.findOne(id);


            if (oldSupplierContact) {
                // Set old data
                this._logger.setOldData(oldSupplierContact);

                // Add new Data
                Object.assign(oldSupplierContact, req);

                // Save Data
                const result = await transaction.save(oldSupplierContact);
                
                await queryRunner.commitTransaction();
                if (result) {
                    this._logger.update(oldSupplierContact);
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
    public async remove(req: SupplierContactRemoveInput): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const transaction = queryRunner.manager;
            if (req && req.id && req.type) {
                let { id, type } = req;
                const supplierContact = await this.findOne(id);
                if (supplierContact instanceof SupplierContact) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(SupplierContact, supplierContact.id);
                        await queryRunner.commitTransaction();
                        this._logger.delete(supplierContact);
                    } else {
                        await transaction.softDelete(SupplierContact, supplierContact.id);
                        await queryRunner.commitTransaction();
                        this._logger.softDelete(supplierContact);
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
