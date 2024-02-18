import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StockPile } from '@/entities/psql/stock-pile.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { StockPileCreateArgInput } from './dto/args/stock-pile.create.arg.input';
import { StockPileFilterArgInput } from './dto/args/stock-pile.filter.arg.input';
import { StockPileRemoveArgInput } from './dto/args/stock-pile.remove.arg.input';
import { StockPileUpdateArgInput } from './dto/args/stock-pile.update.arg.input';
import { StockPileService } from './stock-pile.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { PaginatedResult } from '@/libs/databases/dto/interfaces/result.pagination.interface';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class StockPileResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: StockPileService) {}

    /**
     * Return all Work Unit with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => StockPile, {
        name: 'findAllStockPiles',
    })
    public async findAllStockPiles(
        @Args('filter')
        filter: StockPileFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<PaginatedResult<StockPile>> {
        return this._service.findStockPilesAndPaginationAll(
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
    @Query(() => StockPile, {
        name: 'findOneStockPile',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<StockPile> {
        return this._service.findOne(id);
    }

    /**
     * Create new Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => StockPile, {
        name: 'createStockPile',
    })
    public async create(
        @Args('data')
        data: StockPileCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<StockPile> {
        return this._service.create(data);
    }

    /**
     * Update an existing Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => StockPile, {
        name: 'updateStockPile',
    })
    public async update(
        @Args('data')
        data: StockPileUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<StockPile> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Work Unit
     * @param data
     * @returns
     */
    @Mutation(() => StockPile, {
        name: 'removeStockPile',
    })
    public async remove(
        @Args('data')
        data: StockPileRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
