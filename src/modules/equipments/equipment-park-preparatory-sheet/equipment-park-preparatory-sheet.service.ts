import { PSQL_DB_CONN_NAME } from '@/datasource-config';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateEquipmentParkPreparatorySheetInput } from './dtos/create-equipment-park-preparatory-sheet.input';
import { EquipmentParkPreparatorySheet } from '@/entities/psql/equipment-park-preparatory-sheet.entity';

@Injectable()
export class EquipmentParkPreparatorySheetService {
    constructor(
        @Inject(PSQL_DB_CONN_NAME)
        private dataSource: DataSource,
    ) {}

    async findOne(
        equipmentParkId: number,
    ): Promise<EquipmentParkPreparatorySheet> {
        return this.dataSource
            .getRepository(EquipmentParkPreparatorySheet)
            .findOne({
                where: { equipment_park_id: equipmentParkId },
            });
    }

    async create(
        data: CreateEquipmentParkPreparatorySheetInput,
    ): Promise<EquipmentParkPreparatorySheet> {
        const preparatorySheet = new EquipmentParkPreparatorySheet({
            ...data,
        });

        // TODO: Create PDF

        return this.dataSource
            .getRepository(EquipmentParkPreparatorySheet)
            .save(preparatorySheet);
    }
}
