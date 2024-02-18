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
import { SupplierNoteEntity } from '@/entities/psql/supplier-note.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { SupplierNoteCreateInput } from './dto/inputs/supplier-note.create.input';
import { SupplierNoteFilterArgs } from './dto/args/supplier-note.filter.input';
import { SupplierNoteRemoveInput } from './dto/inputs/supplier-note.remove.input';
import { SupplierNoteUpdateInput } from './dto/inputs/supplier-note.update.input';
import { SupplierNoteService } from './supplier-note.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { LoginEntity } from 'src/entities/psql/LoginEntity';
import Dataloader from 'dataloader';
import { SupplierNotesResponse } from './dto/responses/supplier-notes.response';
import { Supplier } from '@/entities/psql/supplier.entity';
import { UploadEntity } from '@/entities/psql/UploadEntity';
@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => SupplierNoteEntity)
export class SupplierNoteResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: SupplierNoteService) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => SupplierNotesResponse, {
        name: 'findAllSupplierNotes',
    })
    public async findAllSupplierNotes(
        @Args('filter') filter: SupplierNoteFilterArgs,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierNotesResponse> {
        return this._service.findAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => SupplierNoteEntity, { name: 'findOneSupplierNote' })
    public async findOne(@Args('id') id: number): Promise<SupplierNoteEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => SupplierNoteEntity, { name: 'createSupplierNote' })
    public async create(
        @Args('data') data: SupplierNoteCreateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierNoteEntity> {
        data.login = LoginEntity.init(user.sub);
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => SupplierNoteEntity, { name: 'updateSupplierNote' })
    public async update(
        @Args('data') data: SupplierNoteUpdateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierNoteEntity> {
        // data.login = LoginEntity.init(user.sub);
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => SupplierNoteEntity, {
        name: 'removeSupplierNote',
    })
    public async remove(
        @Args('data') data: SupplierNoteRemoveInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    @ResolveField('login', (returns) => LoginEntity)
    public async login(
        @Parent() parent: SupplierNoteEntity,
        @Context('loginLoader') loginLoader: Dataloader<number, LoginEntity>,
    ): Promise<LoginEntity> {
        return parent.login_id ? loginLoader.load(parent.login_id) : null;
    }

    @ResolveField('supplier', (returns) => Supplier)
    public async supplier(
        @Parent() parent: SupplierNoteEntity,
        @Context('supplierLoader')
        supplierLoader: Dataloader<number, Supplier>,
    ): Promise<Supplier> {
        return parent.supplierId
            ? supplierLoader.load(parent.supplierId)
            : null;
    }

    @ResolveField('documents', (returns) => [UploadEntity])
    async pictures(
        @Parent() parent: SupplierNoteEntity,
        @Context('supplierNoteDocumentUploadLoader')
        supplierNoteDocumentUploadLoader: Dataloader<number, UploadEntity[]>,
    ): Promise<UploadEntity[]> {
        return supplierNoteDocumentUploadLoader.load(parent.id);
    }
}
