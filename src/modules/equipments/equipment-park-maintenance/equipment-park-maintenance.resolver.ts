// NestJs
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';

//Librairies
import Dataloader from 'dataloader';

//Decorators

//Guards

//Schemas

//Services
import { EquipmentParkMaintenanceService } from './equipment-park-maintenance.service';

//DTOs
import { UpdateEquipmentParkMaintenanceInput } from './dtos/inputs/update-equipment-park-maintenance.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkMaintenanceInput } from './dtos/inputs/create-equipment-park-maintenance.input';
import { EquipmentParkMaintenanceFilterInput } from './dtos/args/equipment-park-maintenance.filter.arg.input';
import { EquipmentParkMaintenance } from '../../../entities/psql/equipment-park-maintenance.entity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';

@Resolver((of) => EquipmentParkMaintenance)
export class EquipmentParkMaintenanceResolver {
    constructor(
        private equipmentParkMaintenanceService: EquipmentParkMaintenanceService,
    ) {}

    @Query((returns) => PaginatedResult<EquipmentParkMaintenance>, {
        name: 'findAllPaginatedEquipmentParkMaintenances',
    })
    async findAll(
        @Args('filter') filter: EquipmentParkMaintenanceFilterInput,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkMaintenance>> {
        return this.equipmentParkMaintenanceService.findAll(
            filter,
            sort,
            pagination,
        );
    }

    @Query((returns) => EquipmentParkMaintenance, {
        name: 'findOneEquipmentParkMaintenance',
    })
    async findOne(@Args('id') id: number): Promise<EquipmentParkMaintenance> {
        return this.equipmentParkMaintenanceService.findOne(id);
    }

    @Mutation((returns) => EquipmentParkMaintenance, {
        name: 'createEquipmentParkMaintenance',
    })
    async create(
        @Args('data') data: CreateEquipmentParkMaintenanceInput,
    ): Promise<EquipmentParkMaintenance> {
        return this.equipmentParkMaintenanceService.create(data);
    }

    @Mutation((returns) => EquipmentParkMaintenance, {
        name: 'updateEquipmentParkMaintenance',
    })
    async upadte(
        @Args('data') data: UpdateEquipmentParkMaintenanceInput,
    ): Promise<EquipmentParkMaintenance> {
        return this.equipmentParkMaintenanceService.update(data);
    }

    @ResolveField('equipmentPark', (returns) => EquipmentPark)
    async equipmentPark(
        @Parent() parent: EquipmentParkMaintenance,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, EquipmentPark>,
    ): Promise<EquipmentPark> {
        return equipmentParkLoader.load(parent.equipment_park_id);
    }

    @Mutation((returns) => Boolean, {
        name: 'deleteEquipmentParkMaintenance',
    })
    delete(@Args('id') id: number) {
        return this.equipmentParkMaintenanceService.delete(id);
    }
}
