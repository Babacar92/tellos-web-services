import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PurchaseAccountEntity } from 'src/entities/psql/PurchaseAccountEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { PurchaseAccountCreateArgInput } from '../dto/args/purchase-account.create.arg.input';
import { PurchaseAccountFilterArgInput } from '../dto/args/purchase-account.filter.arg.input';
import { PurchaseAccountRemoveArgInput } from '../dto/args/purchase-account.remove.arg.input';
import { PurchaseAccountUpdateArgInput } from '../dto/args/purchase-account.update.arg.input';
import { PurchaseAccountPaginationResultInterface } from '../dto/interfaces/purchase-account.pagination.result.interface';
import { PurchaseAccountService } from '../service/purchase-account.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class PurchaseAccountResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: PurchaseAccountService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => PurchaseAccountEntity, {
        name: 'findAllPurchaseAccounts'
    })
    public async findAllPurchaseAccounts(
        @Args('filter')
        filter: PurchaseAccountFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<PurchaseAccountPaginationResultInterface> {
        return this._service.findPurchaseAccountAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => PurchaseAccountEntity, {
        name: 'findOnePurchaseAccount',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<PurchaseAccountEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => PurchaseAccountEntity, {
        name: 'createPurchaseAccount'
    })
    public async create(
        @Args('data')
        data: PurchaseAccountCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<PurchaseAccountEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => PurchaseAccountEntity, {
        name: 'updatePurchaseAccount'
    })
    public async update(
        @Args('data')
        data: PurchaseAccountUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<PurchaseAccountEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => PurchaseAccountEntity, {
        name: 'removePurchaseAccount'
    })
    public async remove(
        @Args('data')
        data: PurchaseAccountRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
