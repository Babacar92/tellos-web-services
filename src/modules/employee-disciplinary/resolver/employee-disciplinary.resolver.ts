import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EmployeeDisciplinaryCreateArgInput } from '../dto/args/employee-disciplinary.create.arg.input';
import { EmployeeDisciplinaryFilterArgInput } from '../dto/args/employee-disciplinary.filter.arg.input';
import { EmployeeDisciplinaryRemoveArgInput } from '../dto/args/employee-disciplinary.remove.arg.input';
import { EmployeeDisciplinaryUpdateArgInput } from '../dto/args/employee-disciplinary.update.arg.input';
import { EmployeeDisciplinaryPaginationResultInterface } from '../dto/interfaces/employee-disciplinary.pagination.result.interface';
import { EmployeeDisciplinaryService } from '../service/employee-disciplinary.service';
import { EmployeeDisciplinaryEntity } from 'src/entities/psql/EmployeeDisciplinaryEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EmployeeDisciplinaryResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: EmployeeDisciplinaryService,
    ) {}

    /**
     * Return all EmployeeDisciplinary with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => EmployeeDisciplinaryEntity, {
        name: 'findAllEmployeeDisciplinaries',
    })
    public async findAllCareerPath(
        @Args('filter')
        filter: EmployeeDisciplinaryFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDisciplinaryPaginationResultInterface> {
        return this._service.findEmployeeDisciplinaryAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One EmployeeDisciplinary
     * @param id
     * @returns
     */
    @Query(() => EmployeeDisciplinaryEntity, {
        name: 'findOneEmployeeDisciplinary',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<EmployeeDisciplinaryEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new EmployeeDisciplinary
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EmployeeDisciplinaryEntity, {
        name: 'createEmployeeDisciplinary',
    })
    public async create(
        @Args('data')
        data: EmployeeDisciplinaryCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDisciplinaryEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing EmployeeDisciplinary
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EmployeeDisciplinaryEntity, {
        name: 'updateEmployeeDisciplinary',
    })
    public async update(
        @Args('data')
        data: EmployeeDisciplinaryUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDisciplinaryEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing EmployeeDisciplinary
     * @param data
     * @returns
     */
    @Mutation(() => EmployeeDisciplinaryEntity, {
        name: 'removeEmployeeDisciplinary',
    })
    public async remove(
        @Args('data')
        data: EmployeeDisciplinaryRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
