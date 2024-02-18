import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActivityEntity } from 'src/entities/psql/ActivityEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ActivityCreateArgInput } from '../dto/args/activity.create.arg.input';
import { ActivityFilterArgInput } from '../dto/args/activity.filter.arg.input';
import { ActivityRemoveArgInput } from '../dto/args/activity.remove.arg.input';
import { ActivityUpdateArgInput } from '../dto/args/activity.update.arg.input';
import { ActivityPaginationResultInterface } from '../dto/interfaces/activity.pagination.result.interface';
import { ActivityService } from '../service/activity.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class ActivityResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: ActivityService) {}

  /**
   * Return all Activity with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => ActivityEntity, {
    name: 'findAllActivities',
  })
  public async findAllActivities(
    @Args('filter')
    filter: ActivityFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ActivityPaginationResultInterface> {
    return this._service.findActivitiesAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One Activity
   * @param id
   * @returns
   */
  @Query(() => ActivityEntity, {
    name: 'findOneActivity',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<ActivityEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Activity
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => ActivityEntity, {
    name: 'createActivity',
  })
  public async create(
    @Args('data')
    data: ActivityCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ActivityEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Activity
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => ActivityEntity, {
    name: 'updateActivity',
  })
  public async update(
    @Args('data')
    data: ActivityUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ActivityEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Activity
   * @param data
   * @returns
   */
  @Mutation(() => ActivityEntity, {
    name: 'removeActivity',
  })
  public async remove(
    @Args('data')
    data: ActivityRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
