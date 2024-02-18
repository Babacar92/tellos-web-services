import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEquipmentTechnicalInput } from './dtos/update-equipment-technical.input';
import { PSQL_DB_CONN_NAME } from '@/datasource-config';
import { DataSource } from 'typeorm';
import { EquipmentTechnical } from '@/entities/psql/equipment-technical.entity';

@Injectable()
export class EquipmentTechnicalService {
    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
    ) {}

    async update(
        data: UpdateEquipmentTechnicalInput,
    ): Promise<EquipmentTechnical> {
        const { equipmentPark, ...rest } = data;

        const equipmentTechnical = await this.dataSource
            .getRepository(EquipmentTechnical)
            .findOne({
                where: { equipment_park_id: equipmentPark.id },
            });

        if (!equipmentTechnical) {
            throw new NotFoundException();
        }

        await this.dataSource
            .getRepository(EquipmentTechnical)
            .update(equipmentTechnical.id, {
                ...equipmentTechnical,
                ...rest,
            });

        return this.dataSource.getRepository(EquipmentTechnical).findOne({
            where: { equipment_park_id: equipmentPark.id },
        });
    }

    async find(equipmentParkId: number): Promise<EquipmentTechnical> {
        return this.dataSource.getRepository(EquipmentTechnical).findOne({
            where: { equipment_park_id: equipmentParkId },
        });
    }
}
