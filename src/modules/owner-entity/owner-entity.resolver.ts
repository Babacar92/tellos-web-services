import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OwnerEntity } from 'src/entities/psql/owner-entity.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { OwnerEntityCreateArgInput } from './dto/args/owner-entity.create.arg.input';
import { OwnerEntityFilterArgInput } from './dto/args/owner-entity.filter.arg.input';
import { OwnerEntityRemoveArgInput } from './dto/args/owner-entity.remove.arg.input';
import { OwnerEntityUpdateArgInput } from './dto/args/owner-entity.update.arg.input';
import { OwnerEntityPaginationResultInterface } from './dto/interfaces/owner-entity.pagination.result.interface';
import { OwnerEntityService } from './owner-entity.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class OwnerEntityResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: OwnerEntityService) {}

  /**
   * Return all Work Unit with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => OwnerEntity, {
    name: 'findAllOwnerEntities',
  })
  public async findAllOwnerEntities(
    @Args('filter')
    filter: OwnerEntityFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<OwnerEntityPaginationResultInterface> {
    return this._service.findOwnerEntitiesAndPaginationAll(
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
  @Query(() => OwnerEntity, {
    name: 'findOneOwnerEntity',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<OwnerEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => OwnerEntity, {
    name: 'createOwnerEntity',
  })
  public async create(
    @Args('data')
    data: OwnerEntityCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<OwnerEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => OwnerEntity, {
    name: 'updateOwnerEntity',
  })
  public async update(
    @Args('data')
    data: OwnerEntityUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<OwnerEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Work Unit
   * @param data
   * @returns
   */
  @Mutation(() => OwnerEntity, {
    name: 'removeOwnerEntity',
  })
  public async remove(
    @Args('data')
    data: OwnerEntityRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
