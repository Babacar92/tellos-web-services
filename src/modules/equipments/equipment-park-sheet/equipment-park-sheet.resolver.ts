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
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EquipmentParkSheet } from '@/entities/psql/equipment-park-sheet.entity';

//Services
import { EquipmentParkSheetService } from './equipment-park-sheet.service';

//DTOs
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CreateEquipmentParkSheetInput } from './dtos/create-equipment-park-sheet.input';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { UploadEntity } from '@/entities/psql/UploadEntity';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { EquipmentParkSheetFilterInput } from './dtos/equipment-park-sheet.filter.arg.input';
import { LoginEntity } from '@/entities/psql/LoginEntity';

@Resolver((of) => EquipmentParkSheet)
export class EquipmentParkSheetResolver {
    constructor(private equipmentParkSheetService: EquipmentParkSheetService) {}

    @Query((returns) => PaginatedResult<EquipmentParkSheet>, {
        name: 'findAllPaginatedEquipmentParkSheets',
    })
    async findAll(
        @Args('filter') filter: EquipmentParkSheetFilterInput,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentParkSheet>> {
        return this.equipmentParkSheetService.findAll(filter, sort, pagination);
    }

    //
    @Query((returns) => EquipmentParkSheet, {
        name: 'findOneEquipmentParkSheet',
    })
    async findOne(@Args('id') id: number): Promise<EquipmentParkSheet> {
        return this.equipmentParkSheetService.findOne(id);
    }

    @Mutation((returns) => EquipmentParkSheet, {
        name: 'createEquipmentParkSheet',
    })
    async create(
        @Args('data') data: CreateEquipmentParkSheetInput,
    ): Promise<EquipmentParkSheet> {
        return this.equipmentParkSheetService.create(data);
    }

    @ResolveField('user', (returns) => Employee)
    async user(
        @Parent() parent: EquipmentParkSheet,
        @Context('employeeLoader')
        employeeLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        return parent.user_id ? employeeLoader.load(parent.user_id) : null;
    }

    @ResolveField('equipmentPark', (returns) => EquipmentPark)
    async equipmentPark(
        @Parent() parent: EquipmentParkSheet,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, EquipmentPark>,
    ): Promise<EquipmentPark> {
        return parent.equipment_park_id
            ? equipmentParkLoader.load(parent.equipment_park_id)
            : null;
    }

    @ResolveField('controller', (returns) => Employee)
    async controller(
        @Parent() parent: EquipmentParkSheet,
        @Context('loginLoader')
        loginLoader: Dataloader<number, LoginEntity>,
    ): Promise<LoginEntity> {
        console.log('HERE ====>', parent);
        return parent.contoller_id
            ? loginLoader.load(parent.contoller_id)
            : null;
    }

    @ResolveField('photos', (returns) => [UploadEntity])
    async photos(
        @Parent() parent: EquipmentPark,
        @Context('equipmentParkSheetUploadLoader')
        equipmentParkSheetUploadLoader: Dataloader<number, UploadEntity[]>,
    ): Promise<UploadEntity[]> {
        return equipmentParkSheetUploadLoader.load(parent.id);
    }

    @ResolveField('userSignature', (returns) => UploadEntity)
    async userSignature(
        @Parent() parent: EquipmentPark,
    ): Promise<UploadEntity> {
        return this.equipmentParkSheetService.getOneEquipmentParkSheetPictures(
            parent.id,
            'userSignature',
        );
    }

    @ResolveField('controllerSignature', (returns) => UploadEntity)
    async controllerSignature(
        @Parent() parent: EquipmentPark,
    ): Promise<UploadEntity> {
        return this.equipmentParkSheetService.getOneEquipmentParkSheetPictures(
            parent.id,
            'controllerSignature',
        );
    }
}
