import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessTenderTypeEntity } from 'src/entities/psql/BusinessTenderTypeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessTenderTypeCreateArgInput } from '../dto/args/business-tender-type.create.arg.input';
import { BusinessTenderTypeFilterArgInput } from '../dto/args/business-tender-type.filter.arg.input';
import { BusinessTenderTypeRemoveArgInput } from '../dto/args/business-tender-type.remove.arg.input';
import { BusinessTenderTypeUpdateArgInput } from '../dto/args/business-tender-type.update.arg.input';
import { BusinessTenderTypePaginationResultInterface } from '../dto/interfaces/business-tender-type.pagination.result.interface';
import { BusinessTenderTypeService } from '../service/business-tender-type.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessTenderTypeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessTenderTypeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessTenderTypeEntity, {
        name: 'findAllBusinessTenderTypes'
    })
    public async findAllBusinessTenderTypes(
        @Args('filter')
        filter: BusinessTenderTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessTenderTypePaginationResultInterface> {

        return this._service.findBusinessTenderTypesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessTenderTypeEntity, {
        name: 'findOneBusinessTenderType',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessTenderTypeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessTenderTypeEntity, {
        name: 'createBusinessTenderType'
    })
    public async create(
        @Args('data')
        data: BusinessTenderTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessTenderTypeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessTenderTypeEntity, {
        name: 'updateBusinessTenderType'
    })
    public async update(
        @Args('data')
        data: BusinessTenderTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessTenderTypeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessTenderTypeEntity, {
        name: 'removeBusinessTenderType'
    })
    public async remove(
        @Args('data')
        data: BusinessTenderTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
