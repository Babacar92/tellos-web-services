// NestJS
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

// Dataloader
import Dataloader from 'dataloader';

// Schemas
import { Supplier } from '@/entities/psql/supplier.entity';
import { SupplierCategoryEntity } from '@/entities/psql/SupplierCategoryEntity';

// Libs
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { CurrentUser } from '@Libs/auth/decorators/user.resolver.decorators';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import { UserPayloadInterface } from '@Libs/auth/dto/interfaces/user.payload.interface';

// DTOs
// ---- Inputs 
import { SupplierCreateInput } from './dto/inputs/supplier.create.input';
import { SupplierRemoveInput } from './dto/inputs/supplier.remove.input';
import { SupplierUpdateInput } from './dto/inputs/supplier.update.input';
// ---- Args
import { SupplierFilterArgs } from './dto/args/supplier.filter.args';
// ---- Responses
import { SuppliersResponse } from './dto/responses/suppliers.response';

// Services
import { SupplierService } from './supplier.service';

// Guard
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { SupplierLanguageCodeEntity } from '@/entities/psql/SupplierLanguageCodeEntity';


@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => Supplier)
export class SupplierResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: SupplierService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => SuppliersResponse, {
        name: 'findAllSuppliers'
    })
    public async findAllSuppliers(
        @Args('filter') filter: SupplierFilterArgs,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SuppliersResponse> {
        return this._service.findAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => Supplier, { name: 'findOneSupplier' })
    public async findOne( @Args("id") id: number, ): Promise<Supplier> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => Supplier, { name: 'createSupplier' })
    public async create(
        @Args('data') data: SupplierCreateInput,
    ): Promise<Supplier> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => Supplier, { name: 'updateSupplier' })
    public async update(
        @Args('data') data: SupplierUpdateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<Supplier> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => Supplier, {
        name: 'removeSupplier'
    })
    public async remove(
        @Args('data') data: SupplierRemoveInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    @ResolveField('category', (returns) => SupplierCategoryEntity)
    public async category(
        @Parent() parent: Supplier,
        @Context('supplierCategoryLoader') supplierCategoryLoader: Dataloader<number, Supplier>,
    ): Promise<Supplier> {
        return parent.category_id? supplierCategoryLoader.load(parent.category_id) : null;
    }

    @ResolveField('languageCode', (returns) => SupplierLanguageCodeEntity)
    public async languageCode(
        @Parent() parent: Supplier,
        @Context('supplierLanguageCodeLoader') supplierLanguageCodeLoader: Dataloader<number, Supplier>,
    ): Promise<Supplier> {
        return parent.language_code_id? supplierLanguageCodeLoader.load(parent.language_code_id) : null;
    }


}
