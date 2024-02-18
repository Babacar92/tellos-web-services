// NestJS
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

// Dataloader
import Dataloader from 'dataloader';

// Schemas
import { SupplierContact } from '@Entities/supplier-contact.entity';

// Libs
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { CurrentUser } from '@Libs/auth/decorators/user.resolver.decorators';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import { UserPayloadInterface } from '@Libs/auth/dto/interfaces/user.payload.interface';

// DTOs
// ---- Inputs 
import { SupplierContactCreateInput } from './dto/inputs/supplier-contact.create.input';
import { SupplierContactRemoveInput } from './dto/inputs/supplier-contact.remove.input';
import { SupplierContactUpdateInput } from './dto/inputs/supplier-contact.update.input';
// ---- Args
import { SupplierContactFilterArgs } from './dto/args/supplier-contact.filter.args';
// ---- Responses
import { SupplierContactsResponse } from './dto/responses/supplier-contacts.response';

// Services
import { SupplierContactService } from './supplier-contact.service';

// Guard
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { Supplier } from '@/entities/psql/supplier.entity';


@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => SupplierContact)
export class SupplierContactResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: SupplierContactService,
    ) { }

    /**
     * Return all supplier contact with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => SupplierContactsResponse, {
        name: 'findAllSupplierContacts'
    })
    public async findAllSupplierContacts(
        @Args('filter') filter: SupplierContactFilterArgs,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierContactsResponse> {
        return this._service.findAll(filter, sort, pagination);
    }

    /**
     * Return One supplier contact
     * @param id 
     * @returns 
     */
    @Query(() => SupplierContact, { name: 'findOneSupplierContact' })
    public async findOne( @Args("id") id: number, ): Promise<SupplierContact> {
        return this._service.findOne(id);
    }

    /**
     * Create new supplier contact
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => SupplierContact, { name: 'createSupplierContact' })
    public async create(
        @Args('data') data: SupplierContactCreateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierContact> {
        return this._service.create(data);
    }

    /**
     * Update an existing supplier contact
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => SupplierContact, { name: 'updateSupplierContact' })
    public async update(
        @Args('data') data: SupplierContactUpdateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierContact> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing supplier contact
     * @param data 
     * @returns 
     */
    @Mutation(() => SupplierContact, {
        name: 'removeSupplierContact'
    })
    public async remove(
        @Args('data') data: SupplierContactRemoveInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    @ResolveField('supplier', (returns) => Supplier)
    public async supplier(
        @Parent() parent: SupplierContact,
        @Context('supplierLoader') supplierLoader: Dataloader<number, Supplier>,
    ): Promise<Supplier> {
        return parent.supplier_id? supplierLoader.load(parent.supplier_id) : null;
    }
}
