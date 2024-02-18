import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerNoteEntity } from 'src/entities/psql/CustomerNoteEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CustomerNoteCreateArgInput } from '../dto/args/customer-note.create.arg.input';
import { CustomerNoteFilterArgInput } from '../dto/args/customer-note.filter.arg.input';
import { CustomerNoteRemoveArgInput } from '../dto/args/customer-note.remove.arg.input';
import { CustomerNoteUpdateArgInput } from '../dto/args/customer-note.update.arg.input';
import { CustomerNotePaginationResultInterface } from '../dto/interfaces/customer-note.pagination.result.interface';
import { CustomerNoteService } from '../service/customer-note.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { LoginEntity } from 'src/entities/psql/LoginEntity';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class CustomerNoteResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: CustomerNoteService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => CustomerNoteEntity, {
        name: 'findAllCustomerNotes'
    })
    public async findAllCustomerNotes(
        @Args('filter')
        filter: CustomerNoteFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerNotePaginationResultInterface> {

        return this._service.findCustomerNotesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => CustomerNoteEntity, {
        name: 'findOneCustomerNote',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<CustomerNoteEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerNoteEntity, {
        name: 'createCustomerNote'
    })
    public async create(
        @Args('data')
        data: CustomerNoteCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerNoteEntity> {
        data.login = LoginEntity.init(user.sub);

        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CustomerNoteEntity, {
        name: 'updateCustomerNote'
    })
    public async update(
        @Args('data')
        data: CustomerNoteUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CustomerNoteEntity> {
        data.login = LoginEntity.init(user.sub);

        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => CustomerNoteEntity, {
        name: 'removeCustomerNote'
    })
    public async remove(
        @Args('data')
        data: CustomerNoteRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
