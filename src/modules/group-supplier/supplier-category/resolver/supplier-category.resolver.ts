import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SupplierCategoryEntity } from 'src/entities/psql/SupplierCategoryEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { SupplierCategoryCreateArgInput } from '../dto/args/supplier-category.create.arg.input';
import { SupplierCategoryFilterArgInput } from '../dto/args/supplier-category.filter.arg.input';
import { SupplierCategoryRemoveArgInput } from '../dto/args/supplier-category.remove.arg.input';
import { SupplierCategoryUpdateArgInput } from '../dto/args/supplier-category.update.arg.input';
import { SupplierCategoryPaginationResultInterface } from '../dto/interfaces/supplier-category.pagination.result.interface';
import { SupplierCategoryService } from '../service/supplier-category.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class SupplierCategoryResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: SupplierCategoryService) {}

  /**
   * Return all SupplierCategory with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => SupplierCategoryEntity, {
    name: 'findAllSupplierCategories',
  })
  public async findAllSupplierCategorys(
    @Args('filter')
    filter: SupplierCategoryFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<SupplierCategoryPaginationResultInterface> {
    return this._service.findSupplierCategoriesAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One SupplierCategory
   * @param id
   * @returns
   */
  @Query(() => SupplierCategoryEntity, {
    name: 'findOneSupplierCategory',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<SupplierCategoryEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new SupplierCategory
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => SupplierCategoryEntity, {
    name: 'createSupplierCategory',
  })
  public async create(
    @Args('data')
    data: SupplierCategoryCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<SupplierCategoryEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing SupplierCategory
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => SupplierCategoryEntity, {
    name: 'updateSupplierCategory',
  })
  public async update(
    @Args('data')
    data: SupplierCategoryUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<SupplierCategoryEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing SupplierCategory
   * @param data
   * @returns
   */
  @Mutation(() => SupplierCategoryEntity, {
    name: 'removeSupplierCategory',
  })
  public async remove(
    @Args('data')
    data: SupplierCategoryRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
