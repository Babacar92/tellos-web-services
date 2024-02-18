import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerEntity } from 'src/entities/psql/CustomerEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CustomerCreateArgInput } from '../dto/args/customer.create.arg.input';
import { CustomerFilterArgInput } from '../dto/args/customer.filter.arg.input';
import { CustomerRemoveArgInput } from '../dto/args/customer.remove.arg.input';
import { CustomerUpdateArgInput } from '../dto/args/customer.update.arg.input';
import { CustomerPaginationResultInterface } from '../dto/interfaces/customer.pagination.result.interface';
import { CustomerService } from '../service/customer.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class CustomerResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: CustomerService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => CustomerEntity, {
        name: 'findAllCustomers'
    })
    public async findAllCustomers(
        @Args('filter')
        filter: CustomerFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerPaginationResultInterface> {
        return this._service.findCustomersAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => CustomerEntity, {
        name: 'findOneCustomer',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<CustomerEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerEntity, {
        name: 'createCustomer'
    })
    public async create(
        @Args('data')
        data: CustomerCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerEntity, {
        name: 'updateCustomer'
    })
    public async update(
        @Args('data')
        data: CustomerUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => CustomerEntity, {
        name: 'removeCustomer'
    })
    public async remove(
        @Args('data')
        data: CustomerRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
