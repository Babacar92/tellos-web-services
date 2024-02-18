// NestJs
import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

//Database
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';

//TypeOrm
import { DataSource, IsNull, Repository } from 'typeorm';

//Schemas
import { EquipmentAssignment } from 'src/entities/psql/equipment-assignment.entity';
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';

//Services

//DTOs
import { CreateEquipmentAssignmentInput } from './dtos/inputs/create-equipment-assignment.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { addFilters, addSorting } from '@/libs/databases/utils/db.utils';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { EquipmentParkAssignmentFilterArg } from './dtos/args/equipment-assignment.filter.arg';

//Enums

//Logger

@Injectable()
export class EquipmentAssignmentService {
    private columnQueryNames = new Map<string, string>([
        ['id', 'ea.id'],
        ['ids', 'ea.id'],
        ['equipmentParkId', 'ea.equipment_park_id'],
        ['equipmentParkIds', 'ea.equipment_park_id'],
        ['startDate', 'ea.startDate'],
        ['endDate', 'ea.endDate'],
    ]);
    private repository: Repository<EquipmentAssignment>;
    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
    ) {
        this.repository = dataSource.getRepository(EquipmentAssignment);
    }

    async findAll(
        filter: EquipmentParkAssignmentFilterArg,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentAssignment>> {
        try {
            const skip = PaginatedResult.getPaginationSkip(pagination);
            const { limit: take } = pagination;

            const queryBuilder = this.dataSource
                .getRepository(EquipmentAssignment)
                .createQueryBuilder('ea');

            const { startDate, endDate, ...otherFilters } = filter;

            if (startDate) {
                queryBuilder.where('ea.createdAt >= :date', {
                    date: startDate,
                });
            }

            if (startDate) {
                queryBuilder.where('ea.createdAt <= :date', {
                    date: endDate,
                });
            }

            addFilters<EquipmentAssignment, EquipmentParkAssignmentFilterArg>(
                queryBuilder,
                otherFilters,
                this.columnQueryNames,
            );

            addSorting(queryBuilder, sort, this.columnQueryNames);

            queryBuilder.skip(skip);
            queryBuilder.take(take);

            const [results, count] = await queryBuilder.getManyAndCount();

            return PaginatedResult.buildResult<EquipmentAssignment>(
                results,
                count,
                pagination,
            );
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async create(
        data: CreateEquipmentAssignmentInput,
    ): Promise<EquipmentAssignment> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const equipementPark = await queryRunner.manager
                .getRepository(EquipmentPark)
                .findOne({ where: { id: data.equipmentPark.id } });

            if (!equipementPark.active) {
                throw new HttpException(
                    'Equipment is not active',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const currentAssignment = await queryRunner.manager
                .getRepository(EquipmentAssignment)
                .findOne({
                    where: {
                        equipment_park_id: data.equipmentPark.id,
                        endDate: IsNull(),
                    },
                });

            if (currentAssignment) {
                currentAssignment.endDate = data.startDate;
                await queryRunner.manager
                    .getRepository(EquipmentAssignment)
                    .save(currentAssignment);
            }

            const equipmentAssignmentEntity = new EquipmentAssignment();
            equipmentAssignmentEntity.employee = data.employee;
            equipmentAssignmentEntity.equipementPark = data.equipmentPark;
            equipmentAssignmentEntity.startDate = data.startDate;

            await queryRunner.manager.getRepository(EquipmentPark).update(
                { id: data.equipmentPark.id },
                {
                    employee: data.employee,
                    startDate: data.startDate,
                    endDate: null,
                    available: false,
                },
            );

            const newEquipmentAssignment = await queryRunner.manager
                .getRepository(EquipmentAssignment)
                .save(equipmentAssignmentEntity);

            await queryRunner.commitTransaction();

            return newEquipmentAssignment;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async update(data: {
        equipmentParkId: number;
        employeeId: number;
        endDate: Date;
    }): Promise<EquipmentAssignment> {
        const equipmentAssignment = await this.repository.findOne({
            where: {
                equipment_park_id: data.equipmentParkId,
                employee_id: data.employeeId,
                endDate: IsNull(),
            },
        });

        if (!equipmentAssignment) {
            return null;
        }

        equipmentAssignment.endDate = data.endDate;

        await this.dataSource
            .getRepository(EquipmentPark)
            .update(
                { id: data.equipmentParkId },
                { endDate: data.endDate, available: true },
            );

        return this.repository.save(equipmentAssignment);
    }
}
