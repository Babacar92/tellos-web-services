import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GoodReferencePriceEntity } from 'src/entities/psql/GoodReferencePriceEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { GoodReferencePriceCreateArgInput } from '../dto/args/good-reference-price.create.arg.input';
import { GoodReferencePriceFilterArgInput } from '../dto/args/good-reference-price.filter.arg.input';
import { GoodReferencePriceRemoveArgInput } from '../dto/args/good-reference-price.remove.arg.input';
import { GoodReferencePriceUpdateArgInput } from '../dto/args/good-reference-price.update.arg.input';
import { GoodReferencePricePaginationResultInterface } from '../dto/interfaces/good-reference-price.pagination.result.interface';
import { GoodReferencePriceService } from '../service/good-reference-price.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class GoodReferencePriceResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: GoodReferencePriceService) {}

  /**
   * Return all GoodReferencePrice with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => GoodReferencePriceEntity, {
    name: 'findAllGoodReferencePrices',
  })
  public async findAllGoodReferencePrices(
    @Args('filter')
    filter: GoodReferencePriceFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<GoodReferencePricePaginationResultInterface> {
    return this._service.findGoodReferencePricesAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One GoodReferencePrice
   * @param id
   * @returns
   */
  @Query(() => GoodReferencePriceEntity, {
    name: 'findOneGoodReferencePrice',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<GoodReferencePriceEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new GoodReferencePrice
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => GoodReferencePriceEntity, {
    name: 'createGoodReferencePrice',
  })
  public async create(
    @Args('data')
    data: GoodReferencePriceCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<GoodReferencePriceEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing GoodReferencePrice
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => GoodReferencePriceEntity, {
    name: 'updateGoodReferencePrice',
  })
  public async update(
    @Args('data')
    data: GoodReferencePriceUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<GoodReferencePriceEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing GoodReferencePrice
   * @param data
   * @returns
   */
  @Mutation(() => GoodReferencePriceEntity, {
    name: 'removeGoodReferencePrice',
  })
  public async remove(
    @Args('data')
    data: GoodReferencePriceRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
