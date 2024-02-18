// NestJS
import { UseGuards } from '@nestjs/common';
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';

// Dataloader
import Dataloader from 'dataloader';

// Schemas
import { SupplierBilling } from '@Entities/supplier-billing.entity';

// Libs
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { CurrentUser } from '@Libs/auth/decorators/user.resolver.decorators';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import { UserPayloadInterface } from '@Libs/auth/dto/interfaces/user.payload.interface';

// DTOs
// ---- Inputs
import { SupplierBillingCreateInput } from './dto/inputs/supplier-billing.create.input';
import { SupplierBillingRemoveInput } from './dto/inputs/supplier-billing.remove.input';
import { SupplierBillingUpdateInput } from './dto/inputs/supplier-billing.update.input';
// ---- Args
import { SupplierBillingFilterArgs } from './dto/args/supplier-billing.filter.args';
// ---- Responses
import { SupplierBillingsResponse } from './dto/responses/supplier-billings.response';

// Services
import { SupplierBillingService } from './supplier-billing.service';

// Guard
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { Supplier } from '@/entities/psql/supplier.entity';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => SupplierBilling)
export class SupplierBillingResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: SupplierBillingService) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => SupplierBillingsResponse, {
        name: 'findAllSupplierBillings',
    })
    public async findAllSupplierBillings(
        @Args('filter') filter: SupplierBillingFilterArgs,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierBillingsResponse> {
        return this._service.findAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => SupplierBilling, { name: 'findOneSupplierBilling' })
    public async findOne(@Args('id') id: number): Promise<SupplierBilling> {
        return this._service.findOne(id);
    }

    @Query((returns) => SupplierBilling, {
        name: 'findOneSupplierBillingBySupplierId',
    })
    async find(
        @Args('supplierId') supplierId: number,
    ): Promise<SupplierBilling> {
        return this._service.findOneSupplierBillingBySupplierId(supplierId);
    }

    findOneSupplierBillingBySupplierId

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    // @Mutation(() => SupplierBilling, { name: 'createSupplierBilling' })
    // public async create(
    //     @Args('data') data: SupplierBillingCreateInput,
    //     @CurrentUser() user: UserPayloadInterface,
    // ): Promise<SupplierBilling> {
    //     return this._service.create(data);
    // }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => SupplierBilling, { name: 'updateSupplierBilling' })
    public async update(
        @Args('data') data: SupplierBillingUpdateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierBilling> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    // @Mutation(() => SupplierBilling, {
    //     name: 'removeSupplierBilling',
    // })
    // public async remove(
    //     @Args('data') data: SupplierBillingRemoveInput,
    // ): Promise<boolean> {
    //     return this._service.remove(data);
    // }

    @ResolveField('supplier', (returns) => Supplier)
    public async supplier(
        @Parent() parent: SupplierBilling,
        @Context('supplierLoader') supplierLoader: Dataloader<number, Supplier>,
    ): Promise<Supplier> {
        return parent.supplier_id
            ? supplierLoader.load(parent.supplier_id)
            : null;
    }
}
