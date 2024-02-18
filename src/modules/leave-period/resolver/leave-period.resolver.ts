import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { LeavePeriodCreateArgInput } from '../dto/args/leave-period.create.arg.input';
import { LeavePeriodFilterArgInput } from '../dto/args/leave-period.filter.arg.input';
import { LeavePeriodRemoveArgInput } from '../dto/args/leave-period.remove.arg.input';
import { LeavePeriodUpdateArgInput } from '../dto/args/leave-period.update.arg.input';
import { LeavePeriodPaginationResultInterface } from '../dto/interfaces/leave-period.pagination.result.interface';
import { LeavePeriodService } from '../service/leave-period.service';
import { LeavePeriodEntity } from 'src/entities/psql/LeavePeriodEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class LeavePeriodResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(
    private readonly _service: LeavePeriodService,
  ) {}

  /**
   * Return all LeavePeriod with pagination
   * @param filter
   * @param user
   * @returns
   */
  @Query(() => LeavePeriodEntity, {
    name: 'findAllLeavePeriods',
  })
  public async findAllLeavePeriods(
    @Args('filter')
    filter: LeavePeriodFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<LeavePeriodPaginationResultInterface> {
    return this._service.findLeavePeriodsAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One LeavePeriod
   * @param id
   * @returns
   */
  @Query(() => LeavePeriodEntity, {
    name: 'findOneLeavePeriod',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<LeavePeriodEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new LeavePeriod
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => LeavePeriodEntity, {
    name: 'createLeavePeriod',
  })
  public async create(
    @Args('data')
    data: LeavePeriodCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<LeavePeriodEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing LeavePeriod
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => LeavePeriodEntity, {
    name: 'updateLeavePeriod',
  })
  public async update(
    @Args('data')
    data: LeavePeriodUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<LeavePeriodEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing LeavePeriod
   * @param data
   * @returns
   */
  @Mutation(() => LeavePeriodEntity, {
    name: 'removeLeavePeriod',
  })
  public async remove(
    @Args('data')
    data: LeavePeriodRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
