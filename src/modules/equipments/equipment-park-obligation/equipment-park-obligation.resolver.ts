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
import { EquipmentParkObligationService } from './equipment-park-obligation.service';

//DTOs
import { UpdateEquipmentParkObligationInput } from './dtos/inputs/update-equipment-park-obligation.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkObligationInput } from './dtos/inputs/create-equipment-park-obligation.input';
import { EquipmentParkObligationFilterInput } from './dtos/args/equipment-park-obligation.filter.arg.input';
import { EquipmentParkObligation } from '@/entities/psql/equipment-park-obligation.entity';
import { ObligationType } from '@/entities/psql/obligation-type.entity';

@Resolver((of) => EquipmentParkObligation)
export class EquipmentParkObligationResolver {
    constructor(
        private equipmentParkObligationService: EquipmentParkObligationService,
    ) {}

    @Query((returns) => PaginatedResult<EquipmentParkObligation>, {
        name: 'findAllPaginatedEquipmentParkObligations',
    })
    async findAll(
        @Args('filter') filter: EquipmentParkObligationFilterInput,
        @Args('pagination') pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkObligation>> {
        return this.equipmentParkObligationService.findAll(filter, pagination);
    }

    @Query((returns) => EquipmentParkObligation, {
        name: 'findOneEquipmentParkObligation',
    })
    async findOne(@Args('id') id: number): Promise<EquipmentParkObligation> {
        return this.equipmentParkObligationService.findOne(id);
    }

    @Mutation((returns) => EquipmentParkObligation, {
        name: 'createEquipmentParkObligation',
    })
    async create(
        @Args('data') data: CreateEquipmentParkObligationInput,
    ): Promise<EquipmentParkObligation> {
        return this.equipmentParkObligationService.create(data);
    }

    @Mutation((returns) => EquipmentParkObligation, {
        name: 'updateEquipmentParkObligation',
    })
    async upadte(
        @Args('data') data: UpdateEquipmentParkObligationInput,
    ): Promise<EquipmentParkObligation> {
        return this.equipmentParkObligationService.update(data);
    }

    @Mutation((returns) => Boolean, {
        name: 'deleteEquipmentParkObligation',
    })
    delete(
        @Args('id') id: number,
        @Args('cascade') cascade?: boolean,
        @Args('equipmentParkId') equipmentParkId?: number,
        @Args('categoryId') categoryId?: number,
    ) {
        return this.equipmentParkObligationService.delete(
            id,
            cascade,
            equipmentParkId,
            categoryId,
        );
    }

    @ResolveField('label', (returns) => ObligationType)
    async user(
        @Parent() parent: EquipmentParkObligation,
        @Context('obligationTypeLoader')
        obligationTypeLoader: Dataloader<number, ObligationType>,
    ): Promise<ObligationType> {
        return obligationTypeLoader.load(parent.label_id);
    }
}
