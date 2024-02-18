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
import { DataSource, Repository } from 'typeorm';

//Schemas
import { EquipmentParkDocument } from '@/entities/psql/equipment-park-document.entity';
import { EquipmentParkObservation } from '@/entities/psql/equipment-park-observation.entity';

//Services

//DTOs
import { UpdateEquipmentParkObservationInput } from './dtos/inputs/update-equipment-park-observation.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkObservationInput } from './dtos/inputs/create-equipment-park-observation.input';
import { EquipmentParkObservationFilterInput } from './dtos/args/equipment-park-observation.filter.args';
import {
    addFilters,
    addSearch,
    addSorting,
} from '@/libs/databases/utils/db.utils';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';

//Enums

//Logger

@Injectable()
export class EquipmentParkObservationService {
    private repository: Repository<EquipmentParkObservation>;
    columnQueryNames = new Map([
        ['id', 'equipmentObs.id'],
        ['ids', 'equipmentObs.id'],
        ['equipmentParkId', 'equipmentObs.equipment_park_id'],
        ['equipmentParkIds', 'equipmentObs.equipment_park_id'],
        ['observation', 'equipmentObs.observation'],
        ['date', 'equipmentObs.date'],
    ]);
    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
    ) {
        this.repository = dataSource.getRepository(EquipmentParkObservation);
    }

    async findOne(id: number): Promise<EquipmentParkObservation> {
        return this.dataSource.getRepository(EquipmentParkObservation).findOne({
            where: { id },
        });
    }

    async findAll(
        filter: EquipmentParkObservationFilterInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkObservation>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.dataSource
                .getRepository(EquipmentParkObservation)
                .createQueryBuilder('equipmentObs');

            const { startDate, endDate, ...otherFilters } = filter;

            if(startDate || endDate){
                queryBuilder.leftJoinAndSelect( 'equipmentObs.equipmentPark', 'equipmentPark' )
                if (startDate) {
                    queryBuilder.andWhere('equipmentPark.createdAt >= :startDate', {
                        startDate: startDate,
                    });
                }
                if (endDate) {
                    endDate.setHours(23);
                    endDate.setMinutes(59);
                    endDate.setSeconds(59);
                    queryBuilder.andWhere('equipmentPark.createdAt <= :endDate', {
                        endDate: endDate,
                    });
                }
            }


            addFilters<
                EquipmentParkObservation,
                EquipmentParkObservationFilterInput
            >(queryBuilder, otherFilters, this.columnQueryNames);

            addSearch<EquipmentParkDocument>(
                queryBuilder,
                this.columnQueryNames,
                ['observation'],
                otherFilters.search,
            );

            queryBuilder.skip(skip);

            queryBuilder.take(take);

            if (sort.equipmentPark) {
                queryBuilder.orderBy(
                    'equipmentPark.denomination',
                    sort.equipmentPark,
                );
            } else if (sort.startDate || sort.endDate) {
                queryBuilder.orderBy('equipmentPark.startDate', sort.startDate);
            } else if (sort.endDate) {
                queryBuilder.orderBy('equipmentPark.endDate', sort.endDate);
            } else {
                addSorting<EquipmentParkObservation>(
                    queryBuilder,
                    sort,
                    this.columnQueryNames,
                );
            }

            console.log("on est ici ---------------------------------------------", queryBuilder.getQuery());

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<EquipmentParkObservation>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async create(
        data: CreateEquipmentParkObservationInput,
    ): Promise<EquipmentParkObservation> {
        const { equipmentPark, ...rest } = data;
        return this.repository.save(
            new EquipmentParkObservation({
                equipmentPark: equipmentPark,
                equipment_park_id: equipmentPark.id,
                ...rest,
            }),
        );
    }

    async update(
        data: UpdateEquipmentParkObservationInput,
    ): Promise<EquipmentParkObservation> {
        const equipmentDocument = await this.repository.findOne({
            where: {
                id: data.id,
            },
        });

        if (!equipmentDocument) {
            throw new NotFoundException();
        }

        await this.repository.update(
            { id: equipmentDocument.id },
            { ...equipmentDocument, ...data },
        );

        return this.repository.findOne({
            where: {
                id: data.id,
            },
        });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await this.dataSource
                .getRepository(EquipmentParkObservation)
                .delete(id);

            return true;
        } catch (e) {
            throw e;
        }
    }
}
