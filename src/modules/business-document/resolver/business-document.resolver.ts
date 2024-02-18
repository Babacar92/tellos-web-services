import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessDocumentEntity } from 'src/entities/psql/BusinessDocumentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessDocumentCreateArgInput } from '../dto/args/business-document.create.arg.input';
import { BusinessDocumentFilterArgInput } from '../dto/args/business-document.filter.arg.input';
import { BusinessDocumentRemoveArgInput } from '../dto/args/business-document.remove.arg.input';
import { BusinessDocumentUpdateArgInput } from '../dto/args/business-document.update.arg.input';
import { BusinessDocumentPaginationResultInterface } from '../dto/interfaces/business-document.pagination.result.interface';
import { BusinessDocumentService } from '../service/business-document.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { LoginEntity } from '../../../entities/psql/LoginEntity';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessDocumentResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessDocumentService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessDocumentEntity, {
        name: 'findAllBusinessDocuments'
    })
    public async findAllBusinessDocuments(
        @Args('filter')
        filter: BusinessDocumentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentPaginationResultInterface> {

        return this._service.findBusinessDocumentsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessDocumentEntity, {
        name: 'findOneBusinessDocument',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessDocumentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessDocumentEntity, {
        name: 'createBusinessDocument'
    })
    public async create(
        @Args('data')
        data: BusinessDocumentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentEntity> {
        data.login = LoginEntity.init(user.sub);

        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessDocumentEntity, {
        name: 'updateBusinessDocument'
    })
    public async update(
        @Args('data')
        data: BusinessDocumentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentEntity> {
        data.login = LoginEntity.init(user.sub);

        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessDocumentEntity, {
        name: 'removeBusinessDocument'
    })
    public async remove(
        @Args('data')
        data: BusinessDocumentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
