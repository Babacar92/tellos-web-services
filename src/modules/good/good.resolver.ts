import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Good } from 'src/entities/psql/good.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { GoodCreateArgInput } from './dto/inputs/good.create.arg.input';
import { GoodFilterArgInput } from './dto/args/good.filter.args';
import { GoodRemoveArgInput } from './dto/inputs/good.remove.arg.input';
import { GoodUpdateArgInput } from './dto/inputs/good.update.arg.input';
import { GoodPaginationResultInterface } from './dto/responses/goods.response';
import { GoodService } from './good.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class GoodResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: GoodService) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => Good, {
        name: 'findAllGoods',
    })
    public async findAllGoods(
        @Args('filter')
        filter: GoodFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<GoodPaginationResultInterface> {
        return this._service.findGoodsAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => Good, {
        name: 'findOneGood',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<Good> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => Good, {
        name: 'createGood',
    })
    public async create(
        @Args('data')
        data: GoodCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<Good> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => Good, {
        name: 'updateGood',
    })
    public async update(
        @Args('data')
        data: GoodUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<Good> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => Good, {
        name: 'removeGood',
    })
    public async remove(
        @Args('data')
        data: GoodRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
