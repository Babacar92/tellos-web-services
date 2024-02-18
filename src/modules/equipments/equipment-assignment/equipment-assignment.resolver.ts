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
import { EquipmentAssignment } from 'src/entities/psql/equipment-assignment.entity';
import { Employee } from 'src/entities/psql/EmployeeEntity';

//Services
import { EquipmentAssignmentService } from './equipment-assignment.service';

//DTOs
import { CreateEquipmentAssignmentInput } from './dtos/inputs/create-equipment-assignment.input';
import { PaginatedResult } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';
import { EquipmentParkAssignmentFilterArg } from './dtos/args/equipment-assignment.filter.arg';

@Resolver((of) => EquipmentAssignment)
export class EquipmentAssignmentResolver {
    constructor(
        private equipmentAssignmentService: EquipmentAssignmentService,
    ) {}

    @Query((returns) => PaginatedResult<EquipmentAssignment>, {
        name: 'findAllPaginatedEquipmentAssignments',
    })
    async findAllEquipmentAssignments(
        @Args('filter') filter: EquipmentParkAssignmentFilterArg,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
    ): Promise<PaginatedResult<EquipmentAssignment>> {
        return this.equipmentAssignmentService.findAll(
            filter,
            sort,
            pagination,
        );
    }

    @Mutation((returns) => EquipmentAssignment, {
        name: 'createEquipmentAssignment',
    })
    async create(
        @Args('data') data: CreateEquipmentAssignmentInput,
    ): Promise<EquipmentAssignment> {
        return this.equipmentAssignmentService.create(data);
    }

    @ResolveField('employee', (returns) => Employee)
    async employee(
        @Parent() parent: EquipmentAssignment,
        @Context('employeeLoader')
        employeeLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        return employeeLoader.load(parent.employee_id);
    }

    @ResolveField('equipmentPark', (returns) => EquipmentPark)
    async equipmentPark(
        @Parent() parent: EquipmentAssignment,
        @Context('equipmentParkLoader')
        equipmentParkLoader: Dataloader<number, EquipmentPark>,
    ): Promise<EquipmentPark> {
        return equipmentParkLoader.load(parent.equipment_park_id);
    }
}
