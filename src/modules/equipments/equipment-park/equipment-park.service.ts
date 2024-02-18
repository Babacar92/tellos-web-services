// NestJs
import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

//TypeOrm
import { DataSource, In, Repository } from 'typeorm';

//Schemas
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';

//Database
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';

//Services
import { UploadService } from 'src/libs/upload/service/upload.service';
import { EquipmentAssignmentService } from '../equipment-assignment/equipment-assignment.service';

//DTOs
import { CreateEquipmentParkInput } from './dtos/create-equipment-park.input';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { UpdateEquipmentParkInput } from './dtos/update-equipment-park.input';
import { EquipmentAdministrative } from 'src/entities/psql/equipment-adminstrative.entity';
import { EquipmentTechnical } from '../../../entities/psql/equipment-technical.entity';
import { EquipmentParkFilterInput } from './dtos/equipment-park.filter.arg.input';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import {
    addFilters,
    addSearch,
    addSorting,
} from '@/libs/databases/utils/db.utils';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { AbstractRepositoryService } from '@/libs/services/abstract.repository.service';
import { UploadEntity } from '@/entities/psql/UploadEntity';
import { CategoryEquipment } from '@/entities/psql/CategoryEquipmentEntity';
import { EntityUniqueIdentifier } from '@/entities/psql/entity-unique-identifier.entity';

//Enums

//Logger

@Injectable()
export class EquipmentParkService extends AbstractRepositoryService {
    private repository: Repository<EquipmentPark>;
    private columnQueryNames = new Map([
        ['id', 'equipmentP.id'],
        ['ids', 'equipmentP.id'],
        ['categoryId', 'equipmentP.category_id'],
        ['categoryIds', 'equipmentP.category_id'],
        ['employeeId', 'equipmentP.employee_id'],
        ['employeeIds', 'equipmentP.employee_id'],
        ['entityId', 'equipmentP.entity_id'],
        ['entityIds', 'equipmentP.entity_id'],
        ['id', 'equipmentP.id'],
        ['denomination', 'equipmentP.denomination'],
        ['registrationNumber', 'equipmentP.registrationNumber'],
        ['pictures', 'equipmentP.pictures'],
        ['orderNumber', 'equipmentP.orderNumber'],
        ['orderDate', 'equipmentP.orderDate'],
        ['deliveryDate', 'equipmentP.deliveryDate'],
        ['firstCirculation', 'equipmentP.firstCirculation'],
        ['registrationDate', 'equipmentP.registrationDate'],
        ['originalValue', 'equipmentP.originalValue'],
        ['counter', 'equipmentP.counter'],
        ['standardCost', 'equipmentP.standardCost'],
        ['co2Emission', 'equipmentP.co2Emission'],
        ['type', 'equipmentP.type'],
        ['active', 'equipmentP.active'],
        ['available', 'equipmentP.available'],
        ['uniqueIdentifier', 'equipmentP.uniqueIdentifier'],
        ['startDate', 'equipmentP.startDate'],
        ['endDate', 'equipmentP.endDate'],
        ['createdAt', 'equipmentP.createdAt'],
        ['updatedAt', 'equipmentP.updatedAt'],
        ['deletedAt', 'equipmentP.deletedAt'],
        ['createdBy', 'equipmentP.createdBy'],
        ['updatedBy', 'equipmentP.updatedBy'],
    ]);

    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
        private uploadservice: UploadService,
        private equipmentAssignmentService: EquipmentAssignmentService,
    ) {
        super();
        this.repository = this.dataSource.getRepository(EquipmentPark);
    }

    getRepo(repo?: string): Repository<EquipmentPark> {
        return this.dataSource.getRepository(EquipmentPark);
    }

    async findEquipmentParksByIds(ids: number[]): Promise<EquipmentPark[]> {
        const data = await this.repository.find({ where: { id: In(ids) } });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
    }

    async findEquipmentParksPictures(ids: number[]): Promise<UploadEntity[][]> {
        const data = await this.dataSource.getRepository(EquipmentPark).find({
            where: { id: In(ids) },
            relations: ['pictures'],
        });

        return ids.map((id) => {
            const relatedEquipmentPark = data.filter((elt) => elt.id === id);
            return relatedEquipmentPark[0].pictures;
        });
    }

    async getOneEquipmentParkPictures(
        equipmentParkId: number,
    ): Promise<UploadEntity[]> {
        try {
            const park = await this.repository.findOne({
                where: { id: equipmentParkId },
                relations: ['pictures'],
            });

            return park.pictures;
        } catch (e) {
            throw new NotFoundException();
        }
    }

    async exist(entity: number | EquipmentPark): Promise<boolean> {
        const id = entity instanceof EquipmentPark ? entity.id : entity;
        const maybeEquipmentPark = await this.repository.findOne({
            where: { id },
        });

        return maybeEquipmentPark !== undefined && maybeEquipmentPark !== null;
    }

    async create(data: CreateEquipmentParkInput): Promise<EquipmentPark> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entity = await queryRunner.manager
                .getRepository(EntityEntity)
                .findOne({ where: { id: data.entity.id } });

            const category = await queryRunner.manager
                .getRepository(CategoryEquipment)
                .findOne({
                    where: { id: data.category.id },
                });
            const entityUniqueIdentifier = await this.getEntityUniqueIdentifier(
                queryRunner.manager.getRepository(EntityUniqueIdentifier),
                entity,
            );

            const equipmentParkEntity = new EquipmentPark({
                denomination: data.denomination,
                code: this.buildEquipmentParkCode(
                    category,
                    entity,
                    entityUniqueIdentifier,
                ),
                category: data.category,
                entity: data.entity,
            });

            const createdEquipmentPark = await queryRunner.manager
                .getRepository(EquipmentPark)
                .save(equipmentParkEntity);

            await queryRunner.manager
                .getRepository(EquipmentAdministrative)
                .save(
                    new EquipmentAdministrative({
                        equipmentPark: createdEquipmentPark,
                        equipment_park_id: createdEquipmentPark.id,
                    }),
                );

            await queryRunner.manager.getRepository(EquipmentTechnical).save(
                new EquipmentTechnical({
                    equipmentPark: createdEquipmentPark,
                    equipment_park_id: createdEquipmentPark.id,
                }),
            );

            await queryRunner.commitTransaction();

            return createdEquipmentPark;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(
        filter: EquipmentParkFilterInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentPark>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.dataSource
                .getRepository(EquipmentPark)
                .createQueryBuilder('equipmentP');

            const { startDate, endDate, ...otherFilters } = filter;

            if (startDate) {
                queryBuilder.where('equipmentP.createdAt >= :date', {
                    date: startDate,
                });
            }

            if (endDate) {
                queryBuilder.andWhere('equipmentP.createdAt <= :date', {
                    date: endDate,
                });
            }

            addFilters<EquipmentPark, EquipmentParkFilterInput>(
                queryBuilder,
                otherFilters,
                this.columnQueryNames,
            );

            addSearch<EquipmentPark>(
                queryBuilder,
                this.columnQueryNames,
                ['denomination'],
                otherFilters.search,
            );

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            if (sort.entity) {
                queryBuilder
                    .leftJoinAndSelect('equipmentP.entity', 'entity')
                    .orderBy('entity.label', 'ASC');
            } else if (sort.category) {
                queryBuilder
                    .leftJoinAndSelect('equipmentP.category', 'category')
                    .orderBy('category.title', 'DESC');
            } else if (sort.employee) {
                queryBuilder
                    .leftJoinAndSelect('equipmentP.employee', 'employee')
                    .orderBy('employee.lastname', 'DESC');
            } else {
                addSorting<EquipmentPark>(
                    queryBuilder,
                    sort,
                    this.columnQueryNames,
                );
            }

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<EquipmentPark>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async findOne(id: number): Promise<EquipmentPark> {
        try {
            return this.repository.findOne({
                where: { id },
                relations: ['pictures'],
            });
        } catch (e) {
            throw new NotFoundException();
        }
    }

    async update(data: UpdateEquipmentParkInput): Promise<EquipmentPark> {
        const equipmentPark = await this.repository.findOne({
            where: { id: data.id },
            relations: ['pictures'],
        });

        if (!equipmentPark) {
            throw new NotFoundException();
        }

        const { pictures, newPictures, active, ...rest } = data;

        const equipmentParkToUpdate = new EquipmentPark({
            id: equipmentPark.id,
            pictures: equipmentPark.pictures,
            ...rest,
        });

        // Delete existing pictures
        if (pictures && Array.isArray(pictures)) {
            await this.repository
                .createQueryBuilder()
                .relation(EquipmentPark, 'pictures')
                .of(equipmentPark)
                .remove(equipmentPark.pictures);

            equipmentParkToUpdate.pictures = equipmentParkToUpdate.pictures
                .map((picture) => {
                    const exists = pictures.some((p) => picture.id === p);

                    if (!exists) {
                        return undefined;
                    }

                    return picture;
                })
                .filter((pic): pic is UploadEntity => pic !== undefined);
        }

        if (newPictures && newPictures.length > 0) {
            const images =
                await this.uploadservice.saveFromGraphqlUploadMultiple(
                    newPictures,
                );

            equipmentParkToUpdate.pictures.push(...images);
        }

        if (active === false) {
            await this.equipmentAssignmentService.update({
                equipmentParkId: equipmentPark.id,
                employeeId: equipmentPark.employee_id,
                endDate: new Date(),
            });
            equipmentParkToUpdate.employee = null;
            equipmentParkToUpdate.active = false;
            equipmentParkToUpdate.available = false;
        } else {
            equipmentParkToUpdate.active = data.active;
            equipmentParkToUpdate.available = true;
        }

        await this.repository.save(equipmentParkToUpdate);

        return this.repository.findOne({
            where: { id: data.id },
        });
    }

    async remove(id: number): Promise<boolean> {
        try {
            await this.dataSource
                .getRepository(EquipmentAdministrative)
                .delete({ equipment_park_id: id });

            await this.dataSource
                .getRepository(EquipmentTechnical)
                .delete({ equipment_park_id: id });

            await this.repository.delete(id);

            return true;
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    public async getEntityUniqueIdentifier(
        repo: Repository<EntityUniqueIdentifier>,
        entity: EntityEntity,
    ): Promise<EntityUniqueIdentifier> {
        const entityUniqueIdentifier = await repo.findOne({
            where: { entity_id: entity.id },
        });
        let newEntityUniqueIdentifier: EntityUniqueIdentifier;

        if (!entityUniqueIdentifier) {
            newEntityUniqueIdentifier = new EntityUniqueIdentifier({
                entity,
                entity_id: entity.id,
                identifier: 1,
            });
        } else {
            newEntityUniqueIdentifier = new EntityUniqueIdentifier({
                id: entityUniqueIdentifier.id,
                identifier: entityUniqueIdentifier.identifier + 1,
            });
        }

        return repo.save(newEntityUniqueIdentifier);
    }

    buildEquipmentParkCode(
        category: CategoryEquipment,
        entity: EntityEntity,
        uniqueIdentifier: EntityUniqueIdentifier,
    ): string {
        return `${category.code}/${
            entity.identifierNumber
        }/${uniqueIdentifier.identifier.toString().padStart(3, '0')}`;
    }
}
