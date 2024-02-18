import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessPaymentModeEntity } from 'src/entities/psql/BusinessPaymentModeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessPaymentModeCreateArgInput } from '../dto/args/business-payment-mode.create.arg.input';
import { BusinessPaymentModeFilterArgInput } from '../dto/args/business-payment-mode.filter.arg.input';
import { BusinessPaymentModeRemoveArgInput } from '../dto/args/business-payment-mode.remove.arg.input';
import { BusinessPaymentModeUpdateArgInput } from '../dto/args/business-payment-mode.update.arg.input';
import { BusinessPaymentModePaginationResultInterface } from '../dto/interfaces/business-payment-mode.pagination.result.interface';
import { BusinessPaymentModeService } from '../service/business-payment-mode.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessPaymentModeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessPaymentModeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessPaymentModeEntity, {
        name: 'findAllBusinessPaymentModes'
    })
    public async findAllBusinessPaymentModes(
        @Args('filter')
        filter: BusinessPaymentModeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessPaymentModePaginationResultInterface> {

        return this._service.findBusinessPaymentModesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessPaymentModeEntity, {
        name: 'findOneBusinessPaymentMode',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessPaymentModeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessPaymentModeEntity, {
        name: 'createBusinessPaymentMode'
    })
    public async create(
        @Args('data')
        data: BusinessPaymentModeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessPaymentModeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessPaymentModeEntity, {
        name: 'updateBusinessPaymentMode'
    })
    public async update(
        @Args('data')
        data: BusinessPaymentModeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessPaymentModeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessPaymentModeEntity, {
        name: 'removeBusinessPaymentMode'
    })
    public async remove(
        @Args('data')
        data: BusinessPaymentModeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
