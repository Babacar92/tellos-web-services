// NestJs
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

//Database
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';

//TypeOrm
import { DataSource, In, Repository } from 'typeorm';

//Schemas
import { EquipmentParkDocument } from '../../../entities/psql/equipment-park-document.entity';

//Services

//DTOs
import { UpdateEquipmentParkDocumentInput } from './dtos/update-equipment-park-document.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkDocumentInput } from './dtos/create-equipment-park-document.input';
import { EquipmentParkDocumentFilterInput } from './dtos/equipment-park-document.filter.arg.input';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import {
    addFilters,
    addSearch,
    addSorting,
} from '@/libs/databases/utils/db.utils';
import { UploadService } from '@/libs/upload/service/upload.service';
import { EquipmentParkDocumentLogger } from './logger/equipment-park-document.logger';
import { UploadEntity } from '@/entities/psql/UploadEntity';

//Enums

//Logger

@Injectable()
export class EquipmentParkDocumentService {
    private repository: Repository<EquipmentParkDocument>;
    columnQueryNames = new Map([
        ['id', 'equipmentDoc.id'],
        ['ids', 'equipmentDoc.id'],
        ['equipmentParkId', 'equipmentDoc.equipment_park_id'],
        ['equipmentParkIds', 'equipmentDoc.equipment_park_id'],
        ['title', 'equipmentDoc.title'],
        ['file', 'equipmentDoc.file'],
        ['description', 'equipmentDoc.description'],
        ['userId', 'equipmentDoc.user_id'],
        ['userIds', 'equipmentDoc.user_id'],
        ['typeId', 'equipmentDoc.type_id'],
        ['typeIds', 'equipmentDoc.type_id'],
        ['addDate', 'equipmentDoc.addDate'],
        ['createdAt', 'equipmentDoc.createdAt'],
        ['updatedAt', 'equipmentDoc.updatedAt'],
        ['deletedAt', 'equipmentDoc.deletedAt'],
        ['createdBy', 'equipmentDoc.createdBy'],
        ['updatedBy', 'equipmentDoc.updatedBy'],
    ]);
    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
        private readonly _uploadService: UploadService,
        private readonly _logger: EquipmentParkDocumentLogger,
    ) {
        this.repository = dataSource.getRepository(EquipmentParkDocument);
    }

    async findAll(
        filter: EquipmentParkDocumentFilterInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkDocument>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.dataSource
                .getRepository(EquipmentParkDocument)
                .createQueryBuilder('equipmentDoc');

            const { startDate, endDate, ...otherFilters } = filter;

            if (startDate) {
                queryBuilder.andWhere('equipmentPark.createdAt >= :date', {
                    date: startDate,
                });
            }

            if (endDate) {
                queryBuilder.andWhere('equipmentPark.createdAt <= :date', {
                    date: endDate,
                });
            }

            addFilters<EquipmentParkDocument, EquipmentParkDocumentFilterInput>(
                queryBuilder,
                otherFilters,
                this.columnQueryNames,
            );

            addSearch<EquipmentParkDocument>(
                queryBuilder,
                this.columnQueryNames,
                ['title', 'description'],
                otherFilters.search,
            );

            queryBuilder.skip(skip);

            queryBuilder.take(take);

            addSorting<EquipmentParkDocument>(
                queryBuilder,
                sort,
                this.columnQueryNames,
            );

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<EquipmentParkDocument>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async findOne(id: number): Promise<EquipmentParkDocument> {
        return await this.dataSource
            .getRepository(EquipmentParkDocument)
            .findOne({
                where: { id },
            });
    }

    async findEquipmentParkDocumentUpload(ids: number[]): Promise<UploadEntity[]> {
        const data = await this.dataSource.getRepository(EquipmentParkDocument).find({
            where: { id: In(ids) },
            relations: ['file']
        });

        return ids.map((id) => {
            const relatedEquipmentParkDocument = data.filter((elt) => elt.id === id);
            return relatedEquipmentParkDocument[0].file;
        });
    }

    async create(
        data: CreateEquipmentParkDocumentInput,
    ): Promise<EquipmentParkDocument> {
        // const { equipmentPark, ...rest } = data;
        
        // return this.repository.save(
        //     new EquipmentParkDocument({
        //         equipmentPark: equipmentPark,
        //         equipment_park_id: equipmentPark.id,
        //         ...rest,
        //     }),
        // );
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{

            const transaction = queryRunner.manager;

            // Init new Entity Quick Access
            const equipmentParkDocument = new EquipmentParkDocument();

            // Get uploaded file
            const { file, equipmentPark, ...rest } = data;

            // Set Data
            Object.assign(equipmentParkDocument, {
                equipmentPark: equipmentPark,
                equipment_park_id: equipmentPark.id,
                ...rest
            });

            if (file) {
                equipmentParkDocument.file = await this._uploadService.saveFromGraphqlUpload(file, null, null, null, null, transaction);
            }

            // Save hit
            const result = await transaction.getRepository(EquipmentParkDocument).save(equipmentParkDocument);
            await queryRunner.commitTransaction();

            if (result) {
                this._logger.create(equipmentParkDocument);

                return this.findOne(result.id);
            }
        } catch(e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async update(
        data: UpdateEquipmentParkDocumentInput,
    ): Promise<EquipmentParkDocument> {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            const transaction = queryRunner.manager;
            // Extract ID
            const { id, file, ...req } = data;

            // Find existing
            const oldEquipmentParkDocument = await this.findOne(id);


            if (oldEquipmentParkDocument) {
                // Set old data
                this._logger.setOldData(oldEquipmentParkDocument);


                if (file) {
                    oldEquipmentParkDocument.file = await this._uploadService.saveFromGraphqlUpload(
                        file,
                        null,
                        null,
                        oldEquipmentParkDocument.file,
                        null,
                        transaction,
                    );

                }

                // Add new Data
                Object.assign(oldEquipmentParkDocument, req);

                

                // Save Data
                const result = await transaction.save(oldEquipmentParkDocument);
                
                await queryRunner.commitTransaction();
                if (result) {
                    this._logger.update(oldEquipmentParkDocument);
                    return this.findOne(id);
                }
            }
        } catch(e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
        // const equipmentDocument = await this.repository.findOne({
        //     where: {
        //         id: data.id,
        //     },
        // });

        // if (!equipmentDocument) {
        //     throw new NotFoundException();
        // }

        // await this.repository.update(
        //     { id: equipmentDocument.id },
        //     { ...equipmentDocument, ...data },
        // );

        // return this.repository.findOne({
        //     where: {
        //         id: data.id,
        //     },
        // });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await this.dataSource
                .getRepository(EquipmentParkDocument)
                .delete(id);

            return true;
        } catch (e) {
            throw e;
        }
    }
}
