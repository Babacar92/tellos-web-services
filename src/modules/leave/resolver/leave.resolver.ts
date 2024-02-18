import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { LeaveCreateArgInput } from '../dto/args/leave.create.arg.input';
import { LeaveFilterArgInput } from '../dto/args/leave.filter.arg.input';
import { LeaveRemoveArgInput } from '../dto/args/leave.remove.arg.input';
import { LeaveUpdateArgInput } from '../dto/args/leave.update.arg.input';
import { LeavePaginationResultInterface } from '../dto/interfaces/leave.pagination.result.interface';
import { LeaveService } from '../service/leave.service';
import { LeaveEntity } from 'src/entities/psql/LeaveEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { EmployeeService } from '../../employee/service/employee.service';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class LeaveResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: LeaveService,
        private readonly _employeeService: EmployeeService,
    ) {}

    /**
     * Return all Leave with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => LeaveEntity, {
        name: 'findAllLeaves',
    })
    public async findAllLeaves(
        @Args('filter')
        filter: LeaveFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LeavePaginationResultInterface> {
        return this._service.findLeavesAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Leave
     * @param id
     * @returns
     */
    @Query(() => LeaveEntity, {
        name: 'findOneLeave',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<LeaveEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Leave
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => LeaveEntity, {
        name: 'createLeave',
    })
    public async create(
        @Args('data')
        data: LeaveCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LeaveEntity> {
        data.employee = await this._employeeService.findByColumn(
            'login',
            user.sub,
        );
        return this._service.create(data);
    }

    /**
     * Update an existing Leave
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => LeaveEntity, {
        name: 'updateLeave',
    })
    public async update(
        @Args('data')
        data: LeaveUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LeaveEntity> {
        return this._service.update(data);
    }

    /**
     * Validate Leave an existing Leave
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => LeaveEntity, {
        name: 'validateLeave',
    })
    public async validateLeave(
        @Args('data')
        data: LeaveUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LeaveEntity[]> {
        data.decisionMaker = await this._employeeService.findByColumn(
            'login',
            user.sub,
        );
        return this._service.validateLeave(data);
    }

    /**
     * Remove an Existing Leave
     * @param data
     * @returns
     */
    @Mutation(() => LeaveEntity, {
        name: 'removeLeave',
    })
    public async remove(
        @Args('data')
        data: LeaveRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
