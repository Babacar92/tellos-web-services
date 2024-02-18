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
import { DataSource, IsNull, Not } from 'typeorm';

//Schemas

//Services

//DTOs
import { UpdateEquipmentParkObligationInput } from './dtos/inputs/update-equipment-park-obligation.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkObligationInput } from './dtos/inputs/create-equipment-park-obligation.input';
import { EquipmentParkObligationFilterInput } from './dtos/args/equipment-park-obligation.filter.arg.input';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { ObligationTriggerUnitEnum } from '../enums/obligation-trigger-unit.enum';
import { CategoryEquipmentParkObligation } from '../../../entities/psql/category-equipment-park-obligation.entity';
import { CategoryEquipment } from '@/entities/psql/CategoryEquipmentEntity';
import { EquipmentParkObligation } from '@/entities/psql/equipment-park-obligation.entity';
import { addFilters, addSearch } from '@/libs/databases/utils/db.utils';

//Enums

//Logger
@Injectable()
export class EquipmentParkObligationService {
    columnQueryNames = new Map([
        ['id', 'o.id'],
        ['ids', 'o.id'],
        ['equipmentParkId', 'ceo.equipment_park_id'],
        ['equipmentParkIds', 'ceo.equipment_park_id'],
        ['categoryId', 'ceo.category_id'],
        ['categoryIds', 'ceo.category_id'],
        ['label', 'ot.name'],
        ['periodicity', 'o.name'],
        ['createdAt', 'ceo.createdAt'],
        ['updatedAt', 'ceo.updatedAt'],
        ['deletedAt', 'ceo.deletedAt'],
        ['createdBy', 'ceo.createdBy'],
        ['updatedBy', 'ceo.updatedBy'],
    ]);

    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
    ) {}

    async findAll(
        filter: EquipmentParkObligationFilterInput,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkObligation>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.dataSource
                .getRepository(CategoryEquipmentParkObligation)
                .createQueryBuilder('ceo')
                .select()
                .leftJoinAndSelect('ceo.obligation', 'o');

            addFilters(queryBuilder, filter, this.columnQueryNames);

            if (filter.categoryId && !filter.equipmentParkId) {
                queryBuilder.andWhere('ceo.category = :categoryId', {
                    categoryId: filter.categoryId,
                });
                queryBuilder.andWhere('ceo.equipmentPark is null');
            }

            if (filter.search) {
                queryBuilder.leftJoin('o.label', 'ot');
            }

            addSearch(
                queryBuilder,
                this.columnQueryNames,
                ['label'],
                filter.search,
            );

            const [results, count] = await queryBuilder
                .skip(skip)
                .take(take)
                .getManyAndCount();

            return PaginatedResult.buildResult<EquipmentParkObligation>(
                results.map((t) => t.obligation),
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    findOne(id: number) {
        return this.dataSource
            .getRepository(EquipmentParkObligation)
            .findOne({ where: { id } });
    }

    async create(
        data: CreateEquipmentParkObligationInput,
    ): Promise<EquipmentParkObligation> {
        const categoryEquipmentParkObigations: CategoryEquipmentParkObligation[] =
            [];
        let nextControlCounter: number = null;
        let nextControlDate: Date = null;

        //
        if (data.triggerUnit === ObligationTriggerUnitEnum.DATE) {
            nextControlDate = new Date('2001/01/01');
        } else {
            nextControlCounter = 0;
        }

        const obligation = await this.dataSource
            .getRepository(EquipmentParkObligation)
            .save({
                ...data,
                label_id: data.label.id,
                nextControlCounter,
                nextControlDate,
            });

        //From category
        if (data.category) {
            const equipmentParks = await this.dataSource
                .getRepository(EquipmentPark)
                .find({
                    where: { category_id: data.category.id },
                });
            const category = await this.dataSource
                .getRepository(CategoryEquipment)
                .findOne({
                    where: { id: data.category.id },
                });

            categoryEquipmentParkObigations.push(
                new CategoryEquipmentParkObligation({
                    obligation,
                    category,
                }),
            );

            equipmentParks.forEach((equipmentPark) => {
                categoryEquipmentParkObigations.push(
                    new CategoryEquipmentParkObligation({
                        obligation,
                        category,
                        equipmentPark,
                    }),
                );
            });
        } else {
            categoryEquipmentParkObigations.push(
                new CategoryEquipmentParkObligation({
                    obligation: new EquipmentParkObligation({ ...obligation }),
                    equipmentPark: data.equipmentPark,
                }),
            );
        }

        await this.dataSource
            .getRepository(CategoryEquipmentParkObligation)
            .save(categoryEquipmentParkObigations);

        return obligation;
    }

    async update(
        data: UpdateEquipmentParkObligationInput,
    ): Promise<EquipmentParkObligation> {
        const maybeEquipmentObligation = await this.dataSource
            .getRepository(EquipmentParkObligation)
            .findOne({ where: { id: data.id } });

        if (!maybeEquipmentObligation) {
            throw new NotFoundException();
        }

        await this.dataSource
            .getRepository(EquipmentParkObligation)
            .update(data.id, { ...maybeEquipmentObligation, ...data });

        return this.dataSource
            .getRepository(EquipmentParkObligation)
            .findOne({ where: { id: data.id } });
    }

    async delete(
        id: number,
        cascade?: boolean,
        equipmentParkId?: number,
        categoryId?: number,
    ): Promise<boolean> {
        try {
            if (categoryId) {
                if (cascade) {
                    await this.dataSource
                        .getRepository(CategoryEquipmentParkObligation)
                        .delete({ obligation: { id } });

                    await this.dataSource
                        .getRepository(EquipmentParkObligation)
                        .delete(id);
                } else {
                    await this.dataSource
                        .getRepository(CategoryEquipmentParkObligation)
                        .delete({
                            obligation: { id },
                            category: { id: categoryId },
                            equipmentPark: IsNull(),
                        });
                }
            } else {
                await this.dataSource
                    .getRepository(CategoryEquipmentParkObligation)
                    .delete({
                        obligation: { id },
                        equipmentPark: { id: equipmentParkId },
                    });

                const maybeRelation = await this.dataSource
                    .getRepository(CategoryEquipmentParkObligation)
                    .findOne({
                        where: {
                            obligation: { id },
                            equipmentPark: { id: Not(equipmentParkId) },
                        },
                    });

                if (!maybeRelation) {
                    await this.dataSource
                        .getRepository(EquipmentParkObligation)
                        .delete(id);
                }
            }

            return true;
        } catch (e) {
            throw e;
        }
    }
}
