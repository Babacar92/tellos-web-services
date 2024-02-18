import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessBudgetEntity } from 'src/entities/psql/BusinessBudgetEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessBudgetCreateArgInput } from '../dto/args/business-budget.create.arg.input';
import { BusinessBudgetFilterArgInput } from '../dto/args/business-budget.filter.arg.input';
import { BusinessBudgetRemoveArgInput } from '../dto/args/business-budget.remove.arg.input';
import { BusinessBudgetUpdateArgInput } from '../dto/args/business-budget.update.arg.input';
import { BusinessBudgetPaginationResultInterface } from '../dto/interfaces/business-budget.pagination.result.interface';
import { BusinessBudgetService } from '../service/business-budget.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessBudgetResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessBudgetService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessBudgetEntity, {
        name: 'findAllBusinessBudgets'
    })
    public async findAllBusinessBudgets(
        @Args('filter')
        filter: BusinessBudgetFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBudgetPaginationResultInterface> {

        return this._service.findBusinessBudgetsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessBudgetEntity, {
        name: 'findOneBusinessBudget',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessBudgetEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessBudgetEntity, {
        name: 'createBusinessBudget'
    })
    public async create(
        @Args('data')
        data: BusinessBudgetCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBudgetEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessBudgetEntity, {
        name: 'updateBusinessBudget'
    })
    public async update(
        @Args('data')
        data: BusinessBudgetUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBudgetEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessBudgetEntity, {
        name: 'removeBusinessBudget'
    })
    public async remove(
        @Args('data')
        data: BusinessBudgetRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
