import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginPermissionEntity } from 'src/entities/psql/LoginPermissionEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { LoginPermissionCreateArgInput } from '../dto/args/login-permission.create.arg.input';
import { LoginPermissionFilterArgInput } from '../dto/args/login-permission.filter.arg.input';
import { LoginPermissionRemoveArgInput } from '../dto/args/login-permission.remove.arg.input';
import { LoginPermissionUpdateArgInput } from '../dto/args/login-permission.update.arg.input';
import { LoginPermissionPaginationResultInterface } from '../dto/interfaces/login-permission.pagination.result.interface';
import { LoginPermissionService } from '../service/login-permission.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class LoginPermissionResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: LoginPermissionService) {}

  /**
   * Return all quick access with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => LoginPermissionEntity, {
    name: 'findAllLoginPermissions',
  })
  public async findAllLoginPermissions(
    @Args('filter')
    filter: LoginPermissionFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<LoginPermissionPaginationResultInterface> {
    return this._service.findLoginPermissionsAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return all quick access with pagination
   * @param filter
   * @param sort
   * @param user
   * @returns
   */
  @Query(() => LoginPermissionEntity, {
    name: 'listLoginPermissions',
  })
  public async listLoginPermissions(
    @Args('filter')
    filter: LoginPermissionFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<LoginPermissionEntity[]> {
    return this._service.findAll(filter, sort);
  }

  /**
   * Return One Quick Access
   * @param id
   * @returns
   */
  @Query(() => LoginPermissionEntity, {
    name: 'findOneLoginPermission',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<LoginPermissionEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Quick Access
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => LoginPermissionEntity, {
    name: 'createLoginPermission',
  })
  public async create(
    @Args('data')
    data: LoginPermissionCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<LoginPermissionEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Quick Access
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => LoginPermissionEntity, {
    name: 'updateLoginPermission',
  })
  public async update(
    @Args('data')
    data: LoginPermissionUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<LoginPermissionEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Quick Access
   * @param data
   * @returns
   */
  @Mutation(() => LoginPermissionEntity, {
    name: 'removeLoginPermission',
  })
  public async remove(
    @Args('data')
    data: LoginPermissionRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
