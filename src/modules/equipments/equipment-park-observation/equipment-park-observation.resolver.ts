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
import * as Dataloader from 'dataloader';

//Decorators

//Guards

//Schemas
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { EquipmentParkObservation } from '@/entities/psql/equipment-park-observation.entity';

//Services
import { EquipmentParkObservationService } from './equipment-park-observation.service';

//DTOs
import { UpdateEquipmentParkObservationInput } from './dtos/inputs/update-equipment-park-observation.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkObservationInput } from './dtos/inputs/create-equipment-park-observation.input';
import { EquipmentParkObservationFilterInput } from './dtos/args/equipment-park-observation.filter.args';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { UserPayloadInterface } from '@/libs/auth/dto/interfaces/user.payload.interface';
import { CurrentUser } from '@/libs/auth/decorators/user.resolver.decorators';
import { LoginEntity } from '@/entities/psql/LoginEntity';
import { UseGuards } from '@nestjs/common';
import { LoginUserPermissionGuard } from '@/modules/login/guards/login.user.permission.guard';
@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => EquipmentParkObservation)
export class EquipmentParkObservationResolver {
    constructor(
        private equipmentParkObservationService: EquipmentParkObservationService,
    ) {}

    @Query((returns) => PaginatedResult<EquipmentParkObservation>, {
        name: 'findAllPaginatedEquipmentParkObservations',
    })
    async findAllEquipmentAssignments(
        @Args('filter') filter: EquipmentParkObservationFilterInput,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkObservation>> {
        return this.equipmentParkObservationService.findAll(
            filter,
            sort,
            pagination,
        );
    }

    @Query((returns) => EquipmentParkObservation, {
        name: 'findOneEquipmentParkObservation',
    })
    async findOne(@Args('id') id: number): Promise<EquipmentParkObservation> {
        return this.equipmentParkObservationService.findOne(id);
    }

    @Mutation((returns) => EquipmentParkObservation, {
        name: 'createEquipmentParkObservation',
    })
    async create(
        @Args('data') data: CreateEquipmentParkObservationInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<EquipmentParkObservation> {
        console.log("user", user);
        data.login = LoginEntity.init(user.sub);
        return this.equipmentParkObservationService.create(data);
    }

    //
    @Mutation((returns) => EquipmentParkObservation, {
        name: 'updateEquipmentParkObservation',
    })
    async upadte(
        @Args('data') data: UpdateEquipmentParkObservationInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<EquipmentParkObservation> {
        // data.login = LoginEntity.init(user.sub);
        return this.equipmentParkObservationService.update(data);
    }

    @ResolveField('equipmentPark', (returns) => EquipmentPark)
    async equipmentPark(
        @Parent() parent: EquipmentParkObservation,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, EquipmentPark>,
    ): Promise<EquipmentPark> {
        return parent.equipment_park_id
            ? equipmentParkLoader.load(parent.equipment_park_id)
            : null;
    }

    @Mutation((returns) => Boolean, {
        name: 'deleteEquipmentParkObservation',
    })
    delete(@Args('id') id: number) {
        return this.equipmentParkObservationService.delete(id);
    }
}
