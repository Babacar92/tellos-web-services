import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { QuickAccessEntity } from '../../../entities/psql/QuickAccessEntity';
import { CurrentUser } from '../../../libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from '../../../libs/auth/dto/interfaces/user.payload.interface';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { QuickAccessCreateArgInput } from '../dto/args/quick-access.create.arg.input';
import { QuickAccessFilterArgInput } from '../dto/args/quick-access.filter.arg.input';
import { QuickAccessRemoveArgInput } from '../dto/args/quick-access.remove.arg.input';
import { QuickAccessUpdateArgInput } from '../dto/args/quick-access.update.arg.input';
import { QuickAccessPaginationResultInterface } from '../dto/interfaces/quick-access.pagination.result.interface';
import { QuickAccessService } from '../services/quick-access.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { EmployeeService } from '../../employee/service/employee.service';

/**
 * The Quick Access Resolver
 */
@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class QuickAccessResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: QuickAccessService,
        private readonly _employeeService: EmployeeService,
    ) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => QuickAccessEntity, {
        name: 'findAllQuickAccess',
    })
    public async findAllQuickAccess(
        @Args('filter')
        filter: QuickAccessFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QuickAccessPaginationResultInterface> {
        filter.employee = await this._employeeService.findByColumn(
            'login',
            user.sub,
        );

        return this._service.findQuickAccessAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => QuickAccessEntity, {
        name: 'findOneQuickAccess',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<QuickAccessEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => QuickAccessEntity, {
        name: 'createQuickAccess',
    })
    public async create(
        @Args('data')
        data: QuickAccessCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QuickAccessEntity> {
        data.employee = await this._employeeService.findByColumn(
            'login',
            user.sub,
        );

        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => QuickAccessEntity, {
        name: 'updateQuickAccess',
    })
    public async update(
        @Args('data')
        data: QuickAccessUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QuickAccessEntity> {
        data.employee = await this._employeeService.findByColumn(
            'login',
            user.sub,
        );

        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => QuickAccessEntity, {
        name: 'removeQuickAccess',
    })
    public async remove(
        @Args('data')
        data: QuickAccessRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
