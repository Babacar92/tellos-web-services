// NestJs
import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

//Database
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';

//TypeOrm
import { DataSource, In, Repository } from 'typeorm';

//Schemas

//Services

//DTOs
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkSheetInput } from './dtos/create-equipment-park-sheet.input';
import { addFilters, addSorting } from '@/libs/databases/utils/db.utils';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { EquipmentParkSheet } from '@/entities/psql/equipment-park-sheet.entity';
import { UploadEntity } from '@/entities/psql/UploadEntity';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { EquipmentParkSheetFilterInput } from './dtos/equipment-park-sheet.filter.arg.input';
import { UploadService } from '@/libs/upload/service/upload.service';

//Enums

//Logger

@Injectable()
export class EquipmentParkSheetService {
    private repository: Repository<EquipmentParkSheet>;
    columnQueryNames = new Map([
        ['id', 'es.id'],
        ['ids', 'es.id'],
        ['equipmentParkId', 'es.equipment_park_id'],
        ['equipmentParkIds', 'es.equipment_park_id'],
        ['userId', 'es.user_id'],
        ['userIds', 'es.user_id'],
        ['type', 'es.type'],
        ['returnDate', 'es.returnDate'],
        ['user', 'es.user'],
        ['counter', 'es.counter'],
        ['interiorCleanliness', 'es.interiorCleanliness'],
        ['exteriorCleanliness', 'es.exteriorCleanliness'],
    ]);
    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
        private uploadservice: UploadService,
    ) {
        this.repository = dataSource.getRepository(EquipmentParkSheet);
    }

    async findEquipmentParkSheetsPictures(
        ids: number[],
    ): Promise<UploadEntity[][]> {
        const data = await this.dataSource
            .getRepository(EquipmentParkSheet)
            .find({
                where: { id: In(ids) },
                relations: ['photos'],
            });

        return ids.map((id) => {
            const relatedEquipmentParkSheet = data.filter(
                (elt) => elt.id === id,
            );
            return relatedEquipmentParkSheet[0].photos;
        });
    }

    async getOneEquipmentParkSheetPictures(
        equipmentParkId: number,
        relationName: string,
    ): Promise<UploadEntity> {
        const park = await this.repository.findOne({
            where: { id: equipmentParkId },
            relations: [relationName],
        });

        return park[relationName];
    }

    async findOne(id: number): Promise<EquipmentParkSheet> {
        return this.dataSource.getRepository(EquipmentParkSheet).findOne({
            where: { id },
        });
    }

    async findAll(
        filter: EquipmentParkSheetFilterInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkSheet>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.dataSource
                .getRepository(EquipmentParkSheet)
                .createQueryBuilder('es');

            queryBuilder.skip(skip);

            queryBuilder.take(take);

            addFilters<EquipmentParkSheet, EquipmentParkSheetFilterInput>(
                queryBuilder,
                filter,
                this.columnQueryNames,
            );

            if (sort.user) {
                queryBuilder
                    .leftJoinAndSelect('es.user', 'usr')
                    .orderBy('usr.lastname', sort.user);
            } else {
                addSorting<EquipmentParkSheet>(
                    queryBuilder,
                    sort,
                    this.columnQueryNames,
                );
            }

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<EquipmentParkSheet>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async create(
        data: CreateEquipmentParkSheetInput,
    ): Promise<EquipmentParkSheet> {
        const queryRunner = this.dataSource.createQueryRunner();

        // await queryRunner.connect();
        // await queryRunner.startTransaction();

        // try {
        const equipmentPark = await this.dataSource
            .getRepository(EquipmentPark)
            .findOne({
                where: { id: data.equipmentPark.id },
            });

        const { photos, userSignature, controllerSignature, ...rest } = data;
        let sheetPhotos: UploadEntity[] = [];
        let userSignatureImage: UploadEntity;
        let controllerSignatureImage: UploadEntity;

        if (photos && photos.length > 0) {
            sheetPhotos =
                await this.uploadservice.saveFromGraphqlUploadMultiple(
                    photos,
                    null,
                    null,
                    null,
                    queryRunner.manager,
                );
        }

        if (userSignature) {
            userSignatureImage = await this.uploadservice.saveFromGraphqlUpload(
                userSignature,
                null,
                null,
                null,
                null,
                queryRunner.manager,
            );
        }

        if (controllerSignature) {
            controllerSignatureImage =
                await this.uploadservice.saveFromGraphqlUpload(
                    controllerSignature,
                    null,
                    null,
                    null,
                    null,
                    queryRunner.manager,
                );
        }

        const sheet = new EquipmentParkSheet({
            equipmentPark: data.equipmentPark,
            equipment_park_id: data.equipmentPark.id,
            user: equipmentPark.employee,
            user_id: equipmentPark.employee_id,
            controller: data.controller, // TODO: figure this out
            contoller_id: data.controller.id,
            parkNumber: equipmentPark.code,
            counter: equipmentPark.counter, // TODO: Ask
            photos: sheetPhotos,
            userSignature: userSignatureImage,
            controllerSignature: controllerSignatureImage,
            ...rest,
        });

        const result = await this.dataSource
            .getRepository(EquipmentParkSheet)
            .save(sheet);

        return result;
    }
}
