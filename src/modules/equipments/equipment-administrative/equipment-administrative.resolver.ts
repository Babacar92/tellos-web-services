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

//Decorators

//Guards

//Librairies
import Dataloader from 'dataloader';

//Schemas
import { EquipmentAdministrative } from 'src/entities/psql/equipment-adminstrative.entity';

//Services
import { EquipmentAdministrativeService } from './equipment-administrative.service';
import { UpdateEquipmentAdministrativeInput } from './dtos/inputs/update-equipment-administrative.input';
import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';
import { OwnerEntity } from 'src/entities/psql/owner-entity.entity';
import { CustomerEntity } from '@/entities/psql/CustomerEntity';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { Employee } from '@/entities/psql/EmployeeEntity';

//DTOs

@Resolver((of) => EquipmentAdministrative)
export class EquipmentAdministrativeResolver {
    constructor(
        private equipmentAdministrativeService: EquipmentAdministrativeService,
    ) {}

    @Query((returns) => EquipmentAdministrative, {
        name: 'findOneEquipmentAdministrative',
    })
    async find(
        @Args('equipmentParkId') equipmentParkId: number,
    ): Promise<EquipmentAdministrative> {
        return this.equipmentAdministrativeService.find(equipmentParkId);
    }

    @ResolveField('equipmentPark', (returns) => EquipmentFunding)
    async equipmentPark(
        @Parent() parent: EquipmentAdministrative,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, EquipmentPark>,
    ) {
        return parent.equipment_park_id
            ? equipmentParkLoader.load(parent.equipment_park_id)
            : null;
    }

    @ResolveField('funding', (returns) => EquipmentFunding)
    async funding(
        @Parent() parent: EquipmentAdministrative,
        @Context('equipmentFundingLoader')
        equipmentFundingLoader: Dataloader<number, EquipmentFunding>,
    ) {
        return parent.funding_id
            ? equipmentFundingLoader.load(parent.funding_id)
            : null;
    }

    @ResolveField('ownerCompany', (returns) => OwnerEntity)
    async ownerCompany(
        @Parent() parent: EquipmentAdministrative,
        @Context('ownerEntityLoader')
        ownerEntityLoader: Dataloader<number, OwnerEntity>,
    ) {
        return parent.owner_company_id
            ? ownerEntityLoader.load(parent.owner_company_id)
            : null;
    }

    @ResolveField('customerAsCustomer', (returns) => CustomerEntity)
    async customerAsCustomer(
        @Parent() parent: EquipmentAdministrative,
        @Context('customerLoader')
        customerLoader: Dataloader<number, CustomerEntity>,
    ) {
        return parent.customer_as_customer_id
            ? customerLoader.load(parent.customer_as_customer_id)
            : null;
    }

    @ResolveField('customerAsEntity', (returns) => EntityEntity)
    async customerAsEntity(
        @Parent() parent: EquipmentAdministrative,
        @Context('entityLoader')
        entityLoader: Dataloader<number, EntityEntity>,
    ) {
        return parent.customer_as_entity_id
            ? entityLoader.load(parent.customer_as_entity_id)
            : null;
    }

    @ResolveField('usersToNotify', (returns) => [Employee])
    async usersToNotify(
        @Parent() parent: EquipmentAdministrative,
    ): Promise<Employee[]> {
        return this.equipmentAdministrativeService.findUsersToNotify(parent.id);
    }

    @Mutation(() => EquipmentAdministrative, {
        name: 'updateEquipmentAdministrative',
    })
    async update(
        @Args('data') data: UpdateEquipmentAdministrativeInput,
    ): Promise<EquipmentAdministrative> {
        return this.equipmentAdministrativeService.update(data);
    }
}
