import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessDocumentTypeEntity } from 'src/entities/psql/BusinessDocumentTypeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessDocumentTypeCreateArgInput } from '../dto/args/business-document-type.create.arg.input';
import { BusinessDocumentTypeFilterArgInput } from '../dto/args/business-document-type.filter.arg.input';
import { BusinessDocumentTypeRemoveArgInput } from '../dto/args/business-document-type.remove.arg.input';
import { BusinessDocumentTypeUpdateArgInput } from '../dto/args/business-document-type.update.arg.input';
import { BusinessDocumentTypePaginationResultInterface } from '../dto/interfaces/business-document-type.pagination.result.interface';
import { BusinessDocumentTypeService } from '../service/business-document-type.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessDocumentTypeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessDocumentTypeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessDocumentTypeEntity, {
        name: 'findAllBusinessDocumentTypes'
    })
    public async findAllBusinessDocumentTypes(
        @Args('filter')
        filter: BusinessDocumentTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentTypePaginationResultInterface> {

        return this._service.findBusinessDocumentTypesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessDocumentTypeEntity, {
        name: 'findOneBusinessDocumentType',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessDocumentTypeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessDocumentTypeEntity, {
        name: 'createBusinessDocumentType'
    })
    public async create(
        @Args('data')
        data: BusinessDocumentTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentTypeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessDocumentTypeEntity, {
        name: 'updateBusinessDocumentType'
    })
    public async update(
        @Args('data')
        data: BusinessDocumentTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentTypeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessDocumentTypeEntity, {
        name: 'removeBusinessDocumentType'
    })
    public async remove(
        @Args('data')
        data: BusinessDocumentTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
