import { UseGuards } from '@nestjs/common';
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EmployeeCreateArgInput } from '../dto/args/employee.create.arg.input';
import { EmployeeFilterArgInput } from '../dto/args/employee.filter.arg.input';
import { EmployeeRemoveArgInput } from '../dto/args/employee.remove.arg.input';
import { EmployeeUpdateArgInput } from '../dto/args/employee.update.arg.input';
import { EmployeePaginationResultInterface } from '../dto/interfaces/employee.pagination.result.interface';
import { EmployeeService } from '../service/employee.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { EmployeeTypeEnum } from '../dto/enums/employee.type.enum';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import * as Dataloader from 'dataloader';

//
@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => Employee)
export class EmployeeResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: EmployeeService) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query((returns) => Employee, {
        name: 'findAllEmployees',
    })
    public async findAllEmployees(
        @Args('filter')
        filter: EmployeeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeePaginationResultInterface> {
        filter.types = [EmployeeTypeEnum.EMPLOYEE, EmployeeTypeEnum.INTERIM];

        return this._service.findEmployeesAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query((returns) => Employee, {
        name: 'findAllCandidateEmployees',
    })
    public async findAllCandidateEmployees(
        @Args('filter')
        filter: EmployeeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeePaginationResultInterface> {
        filter.type = EmployeeTypeEnum.CANDIDATE;

        return this._service.findEmployeesAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return the logged employeed
     * @param user
     * @returns
     */
    @Query(() => Employee, {
        name: 'findEmployeeLogged',
    })
    public async findEmployeeLogged(
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<Employee> {
        return this._service.findByColumn('login', user.sub);
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => Employee, {
        name: 'findOneEmployee',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<Employee> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => Employee, {
        name: 'createEmployee',
    })
    public async create(
        @Args('data')
        data: EmployeeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<Employee> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => Employee, {
        name: 'updateEmployee',
    })
    public async update(
        @Args('data')
        data: EmployeeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<Employee> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => Employee, {
        name: 'removeEmployee',
    })
    public async remove(
        @Args('data')
        data: EmployeeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    @ResolveField('entity', () => EntityEntity)
    async entity(
        @Parent() parent: Employee,
        @Context('entityLoader') entityLoader: Dataloader<number, EntityEntity>,
    ): Promise<EntityEntity> {
        return parent.entity_id ? entityLoader.load(parent.entity_id) : null;
    }
}
