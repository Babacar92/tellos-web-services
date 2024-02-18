import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessMarketTypeEntity } from 'src/entities/psql/BusinessMarketTypeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessMarketTypeCreateArgInput } from '../dto/args/business-market-type.create.arg.input';
import { BusinessMarketTypeFilterArgInput } from '../dto/args/business-market-type.filter.arg.input';
import { BusinessMarketTypeRemoveArgInput } from '../dto/args/business-market-type.remove.arg.input';
import { BusinessMarketTypeUpdateArgInput } from '../dto/args/business-market-type.update.arg.input';
import { BusinessMarketTypePaginationResultInterface } from '../dto/interfaces/business-market-type.pagination.result.interface';
import { BusinessMarketTypeService } from '../service/business-market-type.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessMarketTypeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessMarketTypeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessMarketTypeEntity, {
        name: 'findAllBusinessMarketTypes'
    })
    public async findAllBusinessMarketTypes(
        @Args('filter')
        filter: BusinessMarketTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessMarketTypePaginationResultInterface> {

        return this._service.findBusinessMarketTypesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessMarketTypeEntity, {
        name: 'findOneBusinessMarketType',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessMarketTypeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessMarketTypeEntity, {
        name: 'createBusinessMarketType'
    })
    public async create(
        @Args('data')
        data: BusinessMarketTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessMarketTypeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessMarketTypeEntity, {
        name: 'updateBusinessMarketType'
    })
    public async update(
        @Args('data')
        data: BusinessMarketTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessMarketTypeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessMarketTypeEntity, {
        name: 'removeBusinessMarketType'
    })
    public async remove(
        @Args('data')
        data: BusinessMarketTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
