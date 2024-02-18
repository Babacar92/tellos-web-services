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
import { LoginEntity } from '@Entities/LoginEntity';
import { SupplierAgency } from '@Entities/supplier-agency.entity';

// Libs
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { CurrentUser } from '@Libs/auth/decorators/user.resolver.decorators';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import { UserPayloadInterface } from '@Libs/auth/dto/interfaces/user.payload.interface';

// DTOs
// ---- Inputs
import { SupplierAgencyCreateInput } from './dto/inputs/supplier-agency.create.input';
import { SupplierAgencyRemoveInput } from './dto/inputs/supplier-agency.remove.input';
import { SupplierAgencyUpdateInput } from './dto/inputs/supplier-agency.update.input';
// ---- Args
import { SupplierAgencyFilterArgs } from './dto/args/supplier-agency.filter.args';
// ---- Responses
import { SupplierAgenciesResponse } from './dto/responses/supplier-agencies.response';

// Services
import { SupplierAgencyService } from './supplier-agency.service';

// Guard
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { Supplier } from '@/entities/psql/supplier.entity';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => SupplierAgency)
export class SupplierAgencyResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: SupplierAgencyService) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => SupplierAgenciesResponse, {
        name: 'findAllSupplierAgencies',
    })
    public async findAllSupplierAgencies(
        @Args('filter') filter: SupplierAgencyFilterArgs,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierAgenciesResponse> {
        return this._service.findAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => SupplierAgency, { name: 'findOneSupplierAgency' })
    public async findOne(@Args('id') id: number): Promise<SupplierAgency> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => SupplierAgency, { name: 'createSupplierAgency' })
    public async create(
        @Args('data') data: SupplierAgencyCreateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierAgency> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => SupplierAgency, { name: 'updateSupplierAgency' })
    public async update(
        @Args('data') data: SupplierAgencyUpdateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierAgency> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => SupplierAgency, {
        name: 'removeSupplierAgency',
    })
    public async remove(
        @Args('data') data: SupplierAgencyRemoveInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    @ResolveField('supplier', (returns) => Supplier)
    public async supplier(
        @Parent() parent: SupplierAgency,
        @Context('supplierLoader')
        supplierLoader: Dataloader<number, Supplier>,
    ): Promise<Supplier> {
        return parent.supplierId
            ? supplierLoader.load(parent.supplierId)
            : null;
    }
}
