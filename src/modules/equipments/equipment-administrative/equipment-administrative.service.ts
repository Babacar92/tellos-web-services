import { EquipmentTheoricalHourService } from '@Modules/equipment-theorical-hour/equipment-theorical-hour.service';
import { DataSource, In } from 'typeorm';
import { PSQL_DB_CONN_NAME } from 'src/datasource-config';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EquipmentAdministrative } from '../../../entities/psql/equipment-adminstrative.entity';
import { UpdateEquipmentAdministrativeInput } from './dtos/inputs/update-equipment-administrative.input';
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';
import { SellTypeEnum } from '../enums/sell-type.enum';
import { EquipmentAssignment } from 'src/entities/psql/equipment-assignment.entity';
import { CategoryEquipment } from '@/entities/psql/CategoryEquipmentEntity';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { Employee } from '@/entities/psql/EmployeeEntity';
import { EntityUniqueIdentifier } from '@/entities/psql/entity-unique-identifier.entity';
import { EquipmentParkService } from '../equipment-park/equipment-park.service';
import { EquipmentTechnical } from '@/entities/psql/equipment-technical.entity';
import { EquipmentParkMaintenance } from '@/entities/psql/equipment-park-maintenance.entity';
import { CategoryEquipmentParkObligation } from '@/entities/psql/category-equipment-park-obligation.entity';

@Injectable()
export class EquipmentAdministrativeService {
    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
        private equipmentTheoricalHourService: EquipmentTheoricalHourService,
        private equipmentParkService: EquipmentParkService,
    ) {}

    async findUsersToNotify(id: number): Promise<Employee[]> {
        const result = await this.dataSource
            .getRepository(EquipmentAdministrative)
            .findOne({
                where: { id },
                relations: ['usersToNotify'],
            });

        return result.usersToNotify ?? [];
    }

    async find(equipmentParkId: number): Promise<EquipmentAdministrative> {
        return this.dataSource.getRepository(EquipmentAdministrative).findOne({
            where: { equipment_park_id: equipmentParkId },
        });
    }

    async update(
        data: UpdateEquipmentAdministrativeInput,
    ): Promise<EquipmentAdministrative> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const equipmentAdministrative = await queryRunner.manager
                .getRepository(EquipmentAdministrative)
                .findOne({
                    where: { id: data.id },
                });
            let updatedEquipmentAdministrative = new EquipmentAdministrative(
                {},
            );

            let users: Employee[] = [];
            const { usersToNotify, sellType, waitingForRelease, ...restData } =
                data;

            if (usersToNotify && usersToNotify.length > 0) {
                users = await this.dataSource
                    .getRepository(Employee)
                    .find({ where: { id: In(data.usersToNotify) } });

                updatedEquipmentAdministrative.usersToNotify = users;
            }

            if (sellType || waitingForRelease === true) {
                const equipmentPark = await queryRunner.manager
                    .getRepository(EquipmentPark)
                    .findOne({
                        where: {
                            id: equipmentAdministrative.equipment_park_id,
                        },
                    });

                if (
                    data.sellType === SellTypeEnum.INTERNAL &&
                    data.customerAsEntity
                ) {
                    const category = await queryRunner.manager
                        .getRepository(CategoryEquipment)
                        .findOne({ where: { id: equipmentPark.category_id } });

                    const entity = await queryRunner.manager
                        .getRepository(EntityEntity)
                        .findOne({ where: { id: equipmentPark.entity_id } });

                    const entityUniqueIdentifier =
                        await this.equipmentParkService.getEntityUniqueIdentifier(
                            queryRunner.manager.getRepository(
                                EntityUniqueIdentifier,
                            ),
                            entity,
                        );

                    //START ------ CREATE NEW  PARK
                    const newEquipmentPark = new EquipmentPark({
                        ...equipmentPark,
                        code: this.equipmentParkService.buildEquipmentParkCode(
                            category,
                            entity,
                            entityUniqueIdentifier,
                        ),
                        entity: data.customerAsEntity,
                        entity_id: data.customerAsEntity.id,
                        employee: null,
                        employee_id: null,
                        originalValue: data.sellingPrice,
                    });

                    delete newEquipmentPark.id;

                    const newlyCreatedEquipmentPark = await queryRunner.manager
                        .getRepository(EquipmentPark)
                        .save(newEquipmentPark);

                    //START ------ CREATE NEW  PARK

                    // START ----- COPY ASSIGNMENTS
                    let assignments = await queryRunner.manager
                        .getRepository(EquipmentAssignment)
                        .find({
                            where: { equipment_park_id: equipmentPark.id },
                        });

                    assignments = assignments.map((assignment) => {
                        if (assignment.endDate === null) {
                            assignment.endDate = new Date();
                        }
                        return assignment;
                    });

                    const newAssignments = assignments.map((assignment) => {
                        return new EquipmentAssignment({
                            startDate: assignment.startDate,
                            endDate: assignment.endDate,
                            employee: assignment.employee,
                            employee_id: assignment.employee_id,
                            equipementPark: newlyCreatedEquipmentPark,
                            equipment_park_id: newlyCreatedEquipmentPark.id,
                        });
                    });

                    await queryRunner.manager
                        .getRepository(EquipmentAssignment)
                        .update(
                            assignments.map((a) => a.id),
                            { endDate: new Date() },
                        );

                    await queryRunner.manager
                        .getRepository(EquipmentAssignment)
                        .save(newAssignments);

                    // END ----- COPY ASSIGNMENTS

                    // START ---- COPY OBLIGATIONS
                    const previousCategoryEquipmentObligations =
                        await queryRunner.manager
                            .getRepository(CategoryEquipmentParkObligation)
                            .find({
                                where: {
                                    equipmentPark: { id: equipmentPark.id },
                                },
                            });
                    const newCategoryEquipmentObligations =
                        previousCategoryEquipmentObligations.map((elt) => {
                            delete elt.id;
                            elt.equipmentPark = newlyCreatedEquipmentPark;
                            return elt;
                        });

                    await queryRunner.manager
                        .getRepository(CategoryEquipmentParkObligation)
                        .save(newCategoryEquipmentObligations);

                    // END ---- COPY OBLIGATIONS

                    // START ---- COPY TECHNICAL
                    const previousTechnical = await queryRunner.manager
                        .getRepository(EquipmentTechnical)
                        .findOne({
                            where: { equipment_park_id: equipmentPark.id },
                        });
                    delete previousTechnical.id;

                    const newEquipmentTechnical = Object.assign(
                        {},
                        previousTechnical,
                    );

                    newEquipmentTechnical.equipmentPark =
                        newlyCreatedEquipmentPark;
                    newEquipmentTechnical.equipment_park_id =
                        newlyCreatedEquipmentPark.id;

                    await queryRunner.manager
                        .getRepository(EquipmentTechnical)
                        .save(newEquipmentTechnical);

                    // END ---- COPY TECHNICAL

                    // START ---- COPY MAINTENANCE
                    const previousMaintenances = await queryRunner.manager
                        .getRepository(EquipmentParkMaintenance)
                        .find({
                            where: { equipment_park_id: equipmentPark.id },
                        });

                    const newMintenances = previousMaintenances.map(
                        (maintenance) => {
                            delete maintenance.id;

                            maintenance.equipmentPark =
                                newlyCreatedEquipmentPark;
                            maintenance.equipment_park_id =
                                newlyCreatedEquipmentPark.id;

                            return maintenance;
                        },
                    );

                    await queryRunner.manager
                        .getRepository(EquipmentParkMaintenance)
                        .save(newMintenances);

                    // END ---- COPY MAINTENANCE
                    const newEquipmentAdministrative =
                        new EquipmentAdministrative({
                            ...equipmentAdministrative,
                            ...restData,
                            equipmentPark: newlyCreatedEquipmentPark,
                            equipment_park_id: newlyCreatedEquipmentPark.id,
                            sellType: null,
                            sellingPrice: null,
                        });

                    delete newEquipmentAdministrative.id;

                    await queryRunner.manager
                        .getRepository(EquipmentAdministrative)
                        .save(newEquipmentAdministrative);
                }

                equipmentPark.active = false;

                await queryRunner.manager
                    .getRepository(EquipmentPark)
                    .update({ id: equipmentPark.id }, { active: false });
            }

            if (data.nbHoursEntered) {
                updatedEquipmentAdministrative.nbHoursEntered =
                    data.nbHoursEntered;
                const theoricalHour =
                    await this.equipmentTheoricalHourService.findFirst();
                updatedEquipmentAdministrative.useRate =
                    data.nbHoursEntered / theoricalHour.value;
            }

            const { customerAsCustomer, ...rest } = restData;

            updatedEquipmentAdministrative.customer_as_customer_id =
                customerAsCustomer?.id;

            updatedEquipmentAdministrative = {
                ...updatedEquipmentAdministrative,
                ...rest,
                customerAsCustomer: customerAsCustomer,
                customer_as_customer_id: customerAsCustomer?.id,
            };

            await queryRunner.manager
                .getRepository(EquipmentAdministrative)
                .save(updatedEquipmentAdministrative);

            await queryRunner.commitTransaction();

            return queryRunner.manager
                .getRepository(EquipmentAdministrative)
                .findOne({
                    where: { id: data.id },
                });
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new HttpException(e.detail, HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            await queryRunner.release();
        }
    }
}
