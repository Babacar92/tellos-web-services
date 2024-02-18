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
import { DataSource } from 'typeorm';

//Schemas

//Services

//DTOs
import { UpdateEquipmentParkMaintenanceInput } from './dtos/inputs/update-equipment-park-maintenance.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkMaintenanceInput } from './dtos/inputs/create-equipment-park-maintenance.input';
import { EquipmentParkMaintenanceFilterInput } from './dtos/args/equipment-park-maintenance.filter.arg.input';
import {
    addFilters,
    addSearch,
    addSorting,
} from '@/libs/databases/utils/db.utils';
import { EquipmentParkMaintenance } from '@/entities/psql/equipment-park-maintenance.entity';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { EquipmentParkWorkUnitTypeEnum } from '../enums/equipment-park-work-unit-type.enum';

//Enums

//Logger
@Injectable()
export class EquipmentParkMaintenanceService {
    columnQueryNames = new Map([
        ['id', 'em.id'],
        ['ids', 'em.id'],
        ['equipmentParkId', 'em.equipment_park_id'],
        ['equipmentParkIds', 'em.equipment_park_id'],
        ['maintenanceNumber', 'em.maintenanceNumber'],
        ['obligation', 'ot.name'],
        ['operation', 'em.operation'],
        ['duration', 'em.duration'],
        ['remark', 'em.remark'],
        ['triggerUnit', 'em.triggerUnit'],
        ['createdAt', 'em.createdAt'],
        ['updatedAt', 'em.updatedAt'],
        ['deletedAt', 'em.deletedAt'],
        ['createdBy', 'em.createdBy'],
        ['updatedBy', 'em.updatedBy'],
    ]);

    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
    ) {}

    async findAll(
        filter: EquipmentParkMaintenanceFilterInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkMaintenance>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.dataSource
                .getRepository(EquipmentParkMaintenance)
                .createQueryBuilder('em');

            const { startDate, ...otherFilters } = filter;

            if (startDate) {
                queryBuilder.andWhere('em.triggerDate >= :date', {
                    date: startDate,
                });
            }

            addFilters<
                EquipmentParkMaintenance,
                EquipmentParkMaintenanceFilterInput
            >(queryBuilder, otherFilters, this.columnQueryNames);

            addSearch(
                queryBuilder,
                this.columnQueryNames,
                ['operation'],
                otherFilters.search,
            );

            addSorting(queryBuilder, sort, this.columnQueryNames);

            queryBuilder.take(take);
            queryBuilder.skip(skip);

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<EquipmentParkMaintenance>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async findOne(id: number): Promise<EquipmentParkMaintenance> {
        return this.dataSource.getRepository(EquipmentParkMaintenance).findOne({
            where: { id },
        });
    }

    async create(
        data: CreateEquipmentParkMaintenanceInput,
    ): Promise<EquipmentParkMaintenance> {
        const maintenance = new EquipmentParkMaintenance(data);
        const latestMaintenance = await this.dataSource
            .getRepository(EquipmentParkMaintenance)
            .find({
                where: { equipment_park_id: data.equipmentPark.id },
                order: { maintenanceNumber: 'DESC' },
                take: 1,
            });

        const equipmentPark = await this.dataSource
            .getRepository(EquipmentPark)
            .findOne({
                where: { id: data.equipmentPark.id },
            });

        maintenance.maintenanceNumber = latestMaintenance[0]
            ? latestMaintenance[0].maintenanceNumber + 1
            : 1;

        maintenance.unitOfWork = equipmentPark.unitOfWork;

        maintenance.triggerDate =
            equipmentPark.unitOfWork === EquipmentParkWorkUnitTypeEnum.MONTHS ||
            equipmentPark.unitOfWork === EquipmentParkWorkUnitTypeEnum.HOURS
                ? new Date()
                : null;

        maintenance.triggerNumber =
            equipmentPark.unitOfWork ===
                EquipmentParkWorkUnitTypeEnum.KILOMETERS ||
            equipmentPark.unitOfWork === EquipmentParkWorkUnitTypeEnum.TONNES
                ? equipmentPark.counter
                : null;

        return this.dataSource
            .getRepository(EquipmentParkMaintenance)
            .save(maintenance);
    }

    async update(
        data: UpdateEquipmentParkMaintenanceInput,
    ): Promise<EquipmentParkMaintenance> {
        const maybeEquipmentObligation = await this.dataSource
            .getRepository(EquipmentParkMaintenance)
            .findOne({ where: { id: data.id } });

        if (!maybeEquipmentObligation) {
            throw new NotFoundException();
        }

        await this.dataSource
            .getRepository(EquipmentParkMaintenance)
            .update(data.id, { ...maybeEquipmentObligation, ...data });

        return this.dataSource
            .getRepository(EquipmentParkMaintenance)
            .findOne({ where: { id: data.id } });
    }

    async delete(id: number): Promise<boolean> {
        try {
            await this.dataSource
                .getRepository(EquipmentParkMaintenance)
                .delete(id);

            return true;
        } catch (e) {
            throw e;
        }
    }
}
