import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DocumentCategoryEntity } from 'src/entities/psql/DocumentCategoryEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { DocumentCategoryCreateArgInput } from '../dto/args/document-category.create.arg.input';
import { DocumentCategoryFilterArgInput } from '../dto/args/document-category.filter.arg.input';
import { DocumentCategoryRemoveArgInput } from '../dto/args/document-category.remove.arg.input';
import { DocumentCategoryUpdateArgInput } from '../dto/args/document-category.update.arg.input';
import { DocumentCategoryPaginationResultInterface } from '../dto/interfaces/document-category.pagination.result.interface';
import { DocumentCategoryService } from '../service/document-category.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class DocumentCategoryResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: DocumentCategoryService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => DocumentCategoryEntity, {
        name: 'findAllDocumentCategories'
    })
    public async findAllDocumentCategories(
        @Args('filter')
        filter: DocumentCategoryFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DocumentCategoryPaginationResultInterface> {

        return this._service.findDocumentCategoriesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => DocumentCategoryEntity, {
        name: 'findOneDocumentCategory',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<DocumentCategoryEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => DocumentCategoryEntity, {
        name: 'createDocumentCategory'
    })
    public async create(
        @Args('data')
        data: DocumentCategoryCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DocumentCategoryEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => DocumentCategoryEntity, {
        name: 'updateDocumentCategory'
    })
    public async update(
        @Args('data')
        data: DocumentCategoryUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DocumentCategoryEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => DocumentCategoryEntity, {
        name: 'removeDocumentCategory'
    })
    public async remove(
        @Args('data')
        data: DocumentCategoryRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
