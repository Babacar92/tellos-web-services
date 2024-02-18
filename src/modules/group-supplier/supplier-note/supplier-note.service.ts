import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { SupplierNoteEntity } from '@/entities/psql/supplier-note.entity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import {
    DataSource,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { SupplierNoteCreateInput } from './dto/inputs/supplier-note.create.input';
import { SupplierNoteFilterArgs } from './dto/args/supplier-note.filter.input';
import { SupplierNoteRemoveInput } from './dto/inputs/supplier-note.remove.input';
import { SupplierNoteUpdateInput } from './dto/inputs/supplier-note.update.input';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { SupplierNoteLogger } from './logger/supplier-note.logger';
import { PSQL_DB_CONN_NAME } from '@/datasource-config';
import { PaginatedResult } from '@/libs/databases/dto/interfaces/result.pagination.interface';
import {
    addFilters,
    addSearch,
    addSorting,
} from '@/libs/databases/utils/db.utils';
import { UploadEntity } from '@/entities/psql/UploadEntity';

//Entity
import { Supplier } from '@/entities/psql/supplier.entity';

enum DatabaseAliasEnum {
    SUPPLIER_NOTE = 'sn',
    SUPPLIER = 's',
    EMPLOYEE = 'e',
    LOGIN = 'l',
}

@Injectable()
export class SupplierNoteService {
    private repository: Repository<SupplierNoteEntity>;

    private baseColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.SUPPLIER_NOTE}.id`],
        ['comment', `${DatabaseAliasEnum.SUPPLIER_NOTE}.comment`],
        ['active', `${DatabaseAliasEnum.SUPPLIER_NOTE}.active`],
        ['createdAt', `${DatabaseAliasEnum.SUPPLIER_NOTE}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.SUPPLIER_NOTE}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.SUPPLIER_NOTE}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.SUPPLIER_NOTE}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.SUPPLIER_NOTE}.updatedBy`],
        ['employee', `${DatabaseAliasEnum.EMPLOYEE}.id`],
        ['employeeId', `${DatabaseAliasEnum.EMPLOYEE}.id`],
        ['login', `${DatabaseAliasEnum.LOGIN}.id`],
        ['loginId', `${DatabaseAliasEnum.LOGIN}.id`],
        ['supplier', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['supplierId', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['supplier.name', `${DatabaseAliasEnum.SUPPLIER}.name`],
    ]);
    /**
     * The column name for search
     */
    private columnQueryNames = new Map([
        ...this.baseColumnQueryNames,
        ['employee', `${DatabaseAliasEnum.EMPLOYEE}.id`],
        ['employeeId', `${DatabaseAliasEnum.EMPLOYEE}.id`],
        ['login', `${DatabaseAliasEnum.LOGIN}.id`],
        ['loginId', `${DatabaseAliasEnum.LOGIN}.id`],
        ['supplier', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['supplierId', `${DatabaseAliasEnum.SUPPLIER}.id`],
        ['supplier.name', `${DatabaseAliasEnum.SUPPLIER}.name`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(PSQL_DB_CONN_NAME) private dataSource: DataSource,
        private readonly _uploadService: UploadService,
        private readonly _logger: SupplierNoteLogger,
    ) {
        this.repository = this.dataSource.getRepository(SupplierNoteEntity);
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
                `${DatabaseAliasEnum.SUPPLIER_NOTE}`,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this.baseColumnQueryNames.get('id')}) AS total`);

            if (SupplierNoteEntity.isColumnString(column)) {
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
        filter: SupplierNoteFilterArgs,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<SupplierNoteEntity>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.repository
                .createQueryBuilder(`${DatabaseAliasEnum.SUPPLIER_NOTE}`)
                .select()
                .leftJoinAndSelect(
                    `${DatabaseAliasEnum.SUPPLIER_NOTE}.supplier`,
                    's',
                );

            //Add FIlters
            addFilters<SupplierNoteEntity, SupplierNoteFilterArgs>(
                queryBuilder,
                filter,
                this.columnQueryNames,
            );

            //Add Search
            addSearch(
                queryBuilder,
                this.columnQueryNames,
                ['denomination'],
                filter.search,
            );

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            addSorting(queryBuilder, sort, this.columnQueryNames);

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<SupplierNoteEntity>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async findOne(id: number): Promise<SupplierNoteEntity> {
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
        data: SupplierNoteCreateInput,
    ): Promise<SupplierNoteEntity> {
        console.log('on est la');
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;

            // Init new Entity Quick Access
            const supplierNote = new SupplierNoteEntity();

            // Get uploaded file
            const { documents, ...rest } = data;

            // Set Data
            Object.assign(supplierNote, rest);

            console.log('rest', rest);
            console.log('supplierNote', supplierNote);

            if (documents?.length) {
                supplierNote.documents =
                    await this._uploadService.saveFromGraphqlUploadMultiple(
                        documents,
                        null,
                        null,
                        null,
                        transaction,
                    );
            }

            // Save hit
            const result = await transaction
                .getRepository(SupplierNoteEntity)
                .save(supplierNote);

            await queryRunner.commitTransaction();

            if (result) {
                this._logger.create(supplierNote);

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
        data: SupplierNoteUpdateInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<SupplierNoteEntity> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            // Extract ID
            const { id, documents, ...req } = data;

            // Find existing
            const oldSupplierNote = await this.findOne(id);

            if (oldSupplierNote) {
                // Set old data
                this._logger.setOldData(oldSupplierNote);

                // Add new Data
                Object.assign(oldSupplierNote, req);

                if (documents?.length) {
                    const oldDocuments = oldSupplierNote.documents || [];

                    if (oldDocuments.length) {
                        for (const i in oldDocuments) {
                            const document = oldDocuments[i];

                            await this._uploadService.remove(
                                {
                                    id: document,
                                    type: REMOVE_TYPES.HARD,
                                },
                                null,
                                transaction,
                            );
                        }
                    }

                    oldSupplierNote.documents =
                        await this._uploadService.saveFromGraphqlUploadMultiple(
                            documents,
                            null,
                            null,
                            null,
                            transaction,
                        );
                } else delete oldSupplierNote.documents;

                // Save Data
                const result = await transaction.save(oldSupplierNote);

                await queryRunner.commitTransaction();
                if (result) {
                    this._logger.update(oldSupplierNote);
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
    public async remove(req: SupplierNoteRemoveInput): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transaction = queryRunner.manager;
            if (req && req.id && req.type) {
                const { id, type } = req;
                const supplierNote = await this.findOne(id);
                if (supplierNote instanceof SupplierNoteEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        for (const k in supplierNote.documents || []) {
                            const document = supplierNote.documents[k];
                            await this._uploadService.remove(
                                { id: document, type: REMOVE_TYPES.HARD },
                                null,
                                transaction,
                            );
                        }
                        await transaction.delete(
                            SupplierNoteEntity,
                            supplierNote.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.delete(supplierNote);
                    } else {
                        await transaction.softDelete(
                            SupplierNoteEntity,
                            supplierNote.id,
                        );
                        await queryRunner.commitTransaction();
                        this._logger.softDelete(supplierNote);
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

    async findSupplierNoteDocumentUpload(
        ids: number[],
    ): Promise<UploadEntity[][]> {
        const data = await this.dataSource
            .getRepository(SupplierNoteEntity)
            .find({
                where: { id: In(ids) },
                relations: ['documents'],
            });

        return ids.map((id) => {
            const supplierNoteDocumentUploads = data.filter(
                (elt) => elt.id === id,
            );
            return supplierNoteDocumentUploads[0].documents;
        });
    }
}
