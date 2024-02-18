import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminDocumentEntity } from 'src/entities/psql/AdminDocumentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { AdminDocumentCreateArgInput } from '../dto/args/admin-document.create.arg.input';
import { AdminDocumentFilterArgInput } from '../dto/args/admin-document.filter.arg.input';
import { AdminDocumentRemoveArgInput } from '../dto/args/admin-document.remove.arg.input';
import { AdminDocumentUpdateArgInput } from '../dto/args/admin-document.update.arg.input';
import { AdminDocumentPaginationResultInterface } from '../dto/interfaces/admin-document.pagination.result.interface';
import { AdminDocumentService } from '../service/admin-document.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class AdminDocumentResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: AdminDocumentService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => AdminDocumentEntity, {
        name: 'findAllAdminDocuments'
    })
    public async findAllQualificationsTypes(
        @Args('filter')
        filter: AdminDocumentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<AdminDocumentPaginationResultInterface> {

        return this._service.findAdminDocumentsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => AdminDocumentEntity, {
        name: 'findOneAdminDocument',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<AdminDocumentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => AdminDocumentEntity, {
        name: 'createAdminDocument'
    })
    public async create(
        @Args('data')
        data: AdminDocumentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<AdminDocumentEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => AdminDocumentEntity, {
        name: 'updateAdminDocument'
    })
    public async update(
        @Args('data')
        data: AdminDocumentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<AdminDocumentEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => AdminDocumentEntity, {
        name: 'removeAdminDocument'
    })
    public async remove(
        @Args('data')
        data: AdminDocumentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
