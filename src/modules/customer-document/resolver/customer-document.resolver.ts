import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerDocumentEntity } from 'src/entities/psql/CustomerDocumentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CustomerDocumentCreateArgInput } from '../dto/args/customer-document.create.arg.input';
import { CustomerDocumentFilterArgInput } from '../dto/args/customer-document.filter.arg.input';
import { CustomerDocumentRemoveArgInput } from '../dto/args/customer-document.remove.arg.input';
import { CustomerDocumentUpdateArgInput } from '../dto/args/customer-document.update.arg.input';
import { CustomerDocumentPaginationResultInterface } from '../dto/interfaces/customer-document.pagination.result.interface';
import { CustomerDocumentService } from '../service/customer-document.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { LoginEntity } from 'src/entities/psql/LoginEntity';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class CustomerDocumentResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: CustomerDocumentService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => CustomerDocumentEntity, {
        name: 'findAllCustomerDocuments'
    })
    public async findAllCustomerDocuments(
        @Args('filter')
        filter: CustomerDocumentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerDocumentPaginationResultInterface> {

        return this._service.findCustomerDocumentsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => CustomerDocumentEntity, {
        name: 'findOneCustomerDocument',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<CustomerDocumentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerDocumentEntity, {
        name: 'createCustomerDocument'
    })
    public async create(
        @Args('data')
        data: CustomerDocumentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerDocumentEntity> {
        data.login = LoginEntity.init(user.sub);

        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerDocumentEntity, {
        name: 'updateCustomerDocument'
    })
    public async update(
        @Args('data')
        data: CustomerDocumentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerDocumentEntity> {
        data.login = LoginEntity.init(user.sub);

        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => CustomerDocumentEntity, {
        name: 'removeCustomerDocument'
    })
    public async remove(
        @Args('data')
        data: CustomerDocumentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
