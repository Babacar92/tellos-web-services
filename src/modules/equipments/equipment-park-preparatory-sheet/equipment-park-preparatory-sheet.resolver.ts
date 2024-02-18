import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { EquipmentParkPreparatorySheetService } from './equipment-park-preparatory-sheet.service';
import { CreateEquipmentParkPreparatorySheetInput } from './dtos/create-equipment-park-preparatory-sheet.input';
import { EquipmentParkPreparatorySheet } from '@/entities/psql/equipment-park-preparatory-sheet.entity';
import { Employee } from '@/entities/psql/EmployeeEntity';
import * as Dataloader from 'dataloader';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';

@Resolver((of) => EquipmentParkPreparatorySheet)
export class EquipmentParkPreparatorySheetResolver {
    constructor(
        private equipmentParkPreparatorySheetService: EquipmentParkPreparatorySheetService,
    ) {}

    @Query((returns) => EquipmentParkPreparatorySheet, {
        name: 'findOneEquipmentParkPreparatorySheet',
    })
    async findOne(
        @Args('equipmentParkId') equipmentParkId: number,
    ): Promise<EquipmentParkPreparatorySheet> {
        return this.equipmentParkPreparatorySheetService.findOne(
            equipmentParkId,
        );
    }

    @Mutation((returns) => EquipmentParkPreparatorySheet, {
        name: 'createEquipmentParkPreparatorySheet',
    })
    async create(
        @Args('data') data: CreateEquipmentParkPreparatorySheetInput,
    ): Promise<EquipmentParkPreparatorySheet> {
        return this.equipmentParkPreparatorySheetService.create(data);
    }

    @ResolveField('equipmentPark', (returns) => EquipmentPark)
    async equipmentPark(
        @Parent() parent: EquipmentParkPreparatorySheet,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        return parent.equipment_park_id
            ? equipmentParkLoader.load(parent.equipment_park_id)
            : null;
    }

    @ResolveField('dieselCardReturnedTo', (returns) => Employee)
    async dieselCardReturnedTo(
        @Parent() parent: EquipmentParkPreparatorySheet,
        @Context('employeeLoader')
        employeeLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        return parent.diesel_card_returned_to_id
            ? employeeLoader.load(parent.diesel_card_returned_to_id)
            : null;
    }

    @ResolveField('chipRemovedAndReturnedTo', (returns) => Employee)
    async chipRemovedAndReturnedTo(
        @Parent() parent: EquipmentParkPreparatorySheet,
        @Context('employeeLoader')
        employeeLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        return parent.chip_removed_and_returned_to_id
            ? employeeLoader.load(parent.chip_removed_and_returned_to_id)
            : null;
    }
}
