import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessPaymentTypeEntity } from 'src/entities/psql/BusinessPaymentTypeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessPaymentTypeCreateArgInput } from '../dto/args/business-payment-type.create.arg.input';
import { BusinessPaymentTypeFilterArgInput } from '../dto/args/business-payment-type.filter.arg.input';
import { BusinessPaymentTypeRemoveArgInput } from '../dto/args/business-payment-type.remove.arg.input';
import { BusinessPaymentTypeUpdateArgInput } from '../dto/args/business-payment-type.update.arg.input';
import { BusinessPaymentTypePaginationResultInterface } from '../dto/interfaces/business-payment-type.pagination.result.interface';
import { BusinessPaymentTypeService } from '../service/business-payment-type.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessPaymentTypeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessPaymentTypeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessPaymentTypeEntity, {
        name: 'findAllBusinessPaymentTypes'
    })
    public async findAllBusinessPaymentTypes(
        @Args('filter')
        filter: BusinessPaymentTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessPaymentTypePaginationResultInterface> {

        return this._service.findBusinessPaymentTypesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessPaymentTypeEntity, {
        name: 'findOneBusinessPaymentType',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessPaymentTypeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessPaymentTypeEntity, {
        name: 'createBusinessPaymentType'
    })
    public async create(
        @Args('data')
        data: BusinessPaymentTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessPaymentTypeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessPaymentTypeEntity, {
        name: 'updateBusinessPaymentType'
    })
    public async update(
        @Args('data')
        data: BusinessPaymentTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessPaymentTypeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessPaymentTypeEntity, {
        name: 'removeBusinessPaymentType'
    })
    public async remove(
        @Args('data')
        data: BusinessPaymentTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
