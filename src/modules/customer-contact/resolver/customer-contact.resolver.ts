import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerContactEntity } from 'src/entities/psql/CustomerContactEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CustomerContactCreateArgInput } from '../dto/args/customer-contact.create.arg.input';
import { CustomerContactFilterArgInput } from '../dto/args/customer-contact.filter.arg.input';
import { CustomerContactRemoveArgInput } from '../dto/args/customer-contact.remove.arg.input';
import { CustomerContactUpdateArgInput } from '../dto/args/customer-contact.update.arg.input';
import { CustomerContactPaginationResultInterface } from '../dto/interfaces/customer-contact.pagination.result.interface';
import { CustomerContactService } from '../service/customer-contact.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class CustomerContactResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: CustomerContactService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => CustomerContactEntity, {
        name: 'findAllCustomerContacts'
    })
    public async findAllCustomerContacts(
        @Args('filter')
        filter: CustomerContactFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerContactPaginationResultInterface> {

        return this._service.findCustomerContactsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => CustomerContactEntity, {
        name: 'findOneCustomerContact',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<CustomerContactEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerContactEntity, {
        name: 'createCustomerContact'
    })
    public async create(
        @Args('data')
        data: CustomerContactCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerContactEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerContactEntity, {
        name: 'updateCustomerContact'
    })
    public async update(
        @Args('data')
        data: CustomerContactUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerContactEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => CustomerContactEntity, {
        name: 'removeCustomerContact'
    })
    public async remove(
        @Args('data')
        data: CustomerContactRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
