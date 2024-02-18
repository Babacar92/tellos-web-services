import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DocumentTypeEntity } from 'src/entities/psql/DocumentTypeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { DocumentTypeCreateArgInput } from '../dto/args/document-type.create.arg.input';
import { DocumentTypeFilterArgInput } from '../dto/args/document-type.filter.arg.input';
import { DocumentTypeRemoveArgInput } from '../dto/args/document-type.remove.arg.input';
import { DocumentTypeUpdateArgInput } from '../dto/args/document-type.update.arg.input';
import { DocumentTypePaginationResultInterface } from '../dto/interfaces/document-type.pagination.result.interface';
import { DocumentTypeService } from '../service/document-type.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class DocumentTypeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: DocumentTypeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => DocumentTypeEntity, {
        name: 'findAllDocumentTypes'
    })
    public async findAllDocumentTypes(
        @Args('filter')
        filter: DocumentTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DocumentTypePaginationResultInterface> {

        return this._service.findDocumentTypesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => DocumentTypeEntity, {
        name: 'findOneDocumentType',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<DocumentTypeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => DocumentTypeEntity, {
        name: 'createDocumentType'
    })
    public async create(
        @Args('data')
        data: DocumentTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DocumentTypeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => DocumentTypeEntity, {
        name: 'updateDocumentType'
    })
    public async update(
        @Args('data')
        data: DocumentTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DocumentTypeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => DocumentTypeEntity, {
        name: 'removeDocumentType'
    })
    public async remove(
        @Args('data')
        data: DocumentTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
