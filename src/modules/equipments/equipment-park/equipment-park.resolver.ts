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

//Schemas
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';

//Guards

//Services
import { EquipmentParkService } from './equipment-park.service';

//DTOs
import { CreateEquipmentParkInput } from './dtos/create-equipment-park.input';
import { UpdateEquipmentParkInput } from './dtos/update-equipment-park.input';
import { DeleteEquipmentParkInput } from './dtos/delete-equipment-park.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from '@/libs/databases/dto/args/pagination.arg';
import { EquipmentParkFilterInput } from './dtos/equipment-park.filter.arg.input';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { UploadEntity } from '@/entities/psql/UploadEntity';

@Resolver((of) => EquipmentPark)
export class EquipmentParkResolver {
    constructor(private equipmentParkService: EquipmentParkService) {}

    @Query((returns) => PaginatedResult<EquipmentPark>, {
        name: 'findAllPaginatedEquipmentParks',
    })
    async findAll(
        @Args('filter') filter: EquipmentParkFilterInput,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentPark>> {
        return this.equipmentParkService.findAll(filter, sort, pagination);
    }

    @Query((returns) => EquipmentPark, { name: 'findOneEquipmentPark' })
    async findOne(@Args('id') id: number): Promise<EquipmentPark> {
        return this.equipmentParkService.findOne(id);
    }

    @ResolveField('entity', (returns) => EntityEntity)
    async entity(
        @Parent() parent: EquipmentPark,
        @Context('entityLoader')
        entityLoader: Dataloader<number, EntityEntity>,
    ): Promise<EntityEntity> {
        return entityLoader.load(parent.entity_id);
    }

    @ResolveField('category', (returns) => CategoryEquipment)
    async category(
        @Parent() parent: EquipmentPark,
        @Context('categoryEquipmentLoader')
        categoryEquipmentLoader: Dataloader<number, CategoryEquipment>,
    ): Promise<CategoryEquipment> {
        return categoryEquipmentLoader.load(parent.category_id);
    }

    @ResolveField('employee', (returns) => Employee)
    async employee(
        @Parent() parent: EquipmentPark,
        @Context('employeeLoader')
        employeeLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        return parent.employee_id
            ? employeeLoader.load(parent.employee_id)
            : null;
    }

    @ResolveField('pictures', (returns) => [UploadEntity])
    async pictures(
        @Parent() parent: EquipmentPark,
        @Context('equipmentParkUploadLoader')
        equipmentParkUploadLoader: Dataloader<number, UploadEntity[]>,
    ): Promise<UploadEntity[]> {
        return equipmentParkUploadLoader.load(parent.id);
    }

    @Mutation(() => EquipmentPark, { name: 'createEquipmentPark' })
    async create(
        @Args('data') data: CreateEquipmentParkInput,
    ): Promise<EquipmentPark> {
        return this.equipmentParkService.create(data);
    }

    @Mutation(() => EquipmentPark, { name: 'updateEquipmentPark' })
    async update(
        @Args('data') data: UpdateEquipmentParkInput,
    ): Promise<EquipmentPark> {
        return this.equipmentParkService.update(data);
    }

    @Mutation(() => Boolean, { name: 'removeEquipmentPark' })
    async remove(
        @Args('data') data: DeleteEquipmentParkInput,
    ): Promise<boolean> {
        return this.equipmentParkService.remove(data.id);
    }
}
