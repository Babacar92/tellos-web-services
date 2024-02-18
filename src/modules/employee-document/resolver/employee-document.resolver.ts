import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmployeeDocumentEntity } from 'src/entities/psql/EmployeeDocumentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EmployeeDocumentCreateArgInput } from '../dto/args/employee-document.create.arg.input';
import { EmployeeDocumentFilterArgInput } from '../dto/args/employee-document.filter.arg.input';
import { EmployeeDocumentRemoveArgInput } from '../dto/args/employee-document.remove.arg.input';
import { EmployeeDocumentUpdateArgInput } from '../dto/args/employee-document.update.arg.input';
import { EmployeeDocumentPaginationResultInterface } from '../dto/interfaces/employee-document.pagination.result.interface';
import { EmployeeDocumentService } from '../service/employee-document.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { EmployeeDocumentSignedArgInput } from '../dto/args/employee-document.signed.arg.input';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class EmployeeDocumentResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: EmployeeDocumentService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => EmployeeDocumentEntity, {
        name: 'findAllEmployeeDocuments'
    })
    public async findAllEmployeeDocuments(
        @Args('filter')
        filter: EmployeeDocumentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDocumentPaginationResultInterface> {

        return this._service.findEmployeeDocumentsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => EmployeeDocumentEntity, {
        name: 'findAllEmployeeDocumentsRequireSignature'
    })
    public async findAllEmployeeDocumentsRequireSignature(
        @Args('filter')
        filter: EmployeeDocumentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDocumentPaginationResultInterface> {
        filter.requireSignature = true;

        return this._service.findEmployeeDocumentsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => EmployeeDocumentEntity, {
        name: 'findAllEmployeeDocumentsRequireNotSignature'
    })
    public async findAllEmployeeDocumentsRequireNotSignature(
        @Args('filter')
        filter: EmployeeDocumentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDocumentPaginationResultInterface> {
        filter.requireSignature = false;

        return this._service.findEmployeeDocumentsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => EmployeeDocumentEntity, {
        name: 'findOneEmployeeDocument',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<EmployeeDocumentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => EmployeeDocumentEntity, {
        name: 'createEmployeeDocument'
    })
    public async create(
        @Args('data')
        data: EmployeeDocumentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDocumentEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => EmployeeDocumentEntity, {
        name: 'updateEmployeeDocument'
    })
    public async update(
        @Args('data')
        data: EmployeeDocumentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EmployeeDocumentEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => EmployeeDocumentEntity, {
        name: 'removeEmployeeDocument'
    })
    public async remove(
        @Args('data')
        data: EmployeeDocumentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    /**
     * Set signed file if is signed
     * @param data 
     * @returns 
     */
    @Mutation(() => EmployeeDocumentEntity, {
        name: 'signEmployeeDocument',
    })
    public async signEmployeeDocument(
        @Args('data')
        data: EmployeeDocumentSignedArgInput,
    ): Promise<boolean> {
        return this._service.signEmployeeDocument(data);
    }

    /**
     * Accept file
     * @param id 
     * @returns 
     */
    @Mutation(() => EmployeeDocumentEntity, {
        name: 'acceptEmployeeDocument',
    })
    public async acceptEmployeeDocument(
        @Args('id')
        id: number,
    ): Promise<boolean> {
        return this._service.acceptEmployeeDocument(id);
    }

    /**
     * Refuse file
     * @param id 
     * @returns 
     */
    @Mutation(() => EmployeeDocumentEntity, {
        name: 'refuseEmployeeDocument',
    })
    public async refuseEmployeeDocument(
        @Args('id')
        id: number,
    ): Promise<boolean> {
        return this._service.refuseEmployeeDocument(id);
    }

}
