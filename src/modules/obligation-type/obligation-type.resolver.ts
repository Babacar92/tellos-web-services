import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ObligationType } from '@/entities/psql/obligation-type.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ObligationTypeCreateArgInput } from './dto/args/obligation-type.create.arg.input';
import { ObligationTypeFilterArgInput } from './dto/args/obligation-type.filter.arg.input';
import { ObligationTypeRemoveArgInput } from './dto/args/obligation-type.remove.arg.input';
import { ObligationTypeUpdateArgInput } from './dto/args/obligation-type.update.arg.input';
import { ObligationTypePaginationResultInterface } from './dto/interfaces/obligation-type.pagination.result.interface';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { ObligationTypeService } from './obligation-type.service';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => ObligationType)
export class ObligationTypeResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: ObligationTypeService) {}

    /**
     * Return all Work Unit with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => ObligationType, {
        name: 'findAllObligationTypes',
    })
    public async findAllObligationTypes(
        @Args('filter')
        filter: ObligationTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ObligationTypePaginationResultInterface> {
        //
        return this._service.findObligationTypesAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Work Unit
     * @param id
     * @returns
     */
    @Query(() => ObligationType, {
        name: 'findOneObligationType',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<ObligationType> {
        return this._service.findOne(id);
    }

    /**
     * Create new Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ObligationType, {
        name: 'createObligationType',
    })
    public async create(
        @Args('data')
        data: ObligationTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ObligationType> {
        return this._service.create(data);
    }

    /**
     * Update an existing Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ObligationType, {
        name: 'updateObligationType',
    })
    public async update(
        @Args('data')
        data: ObligationTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ObligationType> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Work Unit
     * @param data
     * @returns
     */
    @Mutation(() => ObligationType, {
        name: 'removeObligationType',
    })
    public async remove(
        @Args('data')
        data: ObligationTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
