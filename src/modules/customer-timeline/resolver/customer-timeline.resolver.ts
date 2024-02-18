import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomerTimelineEntity } from 'src/entities/psql/CustomerTimelineEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CustomerTimelineCreateArgInput } from '../dto/args/customer-timeline.create.arg.input';
import { CustomerTimelineFilterArgInput } from '../dto/args/customer-timeline.filter.arg.input';
import { CustomerTimelineRemoveArgInput } from '../dto/args/customer-timeline.remove.arg.input';
import { CustomerTimelineUpdateArgInput } from '../dto/args/customer-timeline.update.arg.input';
import { CustomerTimelinePaginationResultInterface } from '../dto/interfaces/customer-timeline.pagination.result.interface';
import { CustomerTimelineService } from '../service/customer-timeline.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { LoginEntity } from 'src/entities/psql/LoginEntity';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class CustomerTimelineResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: CustomerTimelineService) {}

  /**
   * Return all quick access with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => CustomerTimelineEntity, {
    name: 'findAllCustomerTimelines',
  })
  public async findAllCustomerTimelines(
    @Args('filter')
    filter: CustomerTimelineFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<CustomerTimelinePaginationResultInterface> {
    return this._service.findCustomerTimelinesAndPaginationAll(
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
  @Query(() => CustomerTimelineEntity, {
    name: 'findOneCustomerTimeline',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<CustomerTimelineEntity> {
    return this._service.findOne(id);
  }

  /**
   * Return One Quick Access
   * @returns
   * @param customerId
   */
  @Query(() => CustomerTimelineEntity, {
    name: 'customerTimelineCountByType',
  })
  public async customerTimelineCountByType(
    @Args('customerId')
    customerId: number,
  ): Promise<{ [key: string]: number }> {
    return this._service.countByType(customerId);
  }

  /**
   * Create new Quick Access
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => CustomerTimelineEntity, {
    name: 'createCustomerTimeline',
  })
  public async create(
    @Args('data')
    data: CustomerTimelineCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<CustomerTimelineEntity> {
    data.login = LoginEntity.init(user.sub);

    return this._service.create(data);
  }

  /**
   * Update an existing Quick Access
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => CustomerTimelineEntity, {
    name: 'updateCustomerTimeline',
  })
  public async update(
    @Args('data')
    data: CustomerTimelineUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<CustomerTimelineEntity> {
    data.login = LoginEntity.init(user.sub);

    return this._service.update(data);
  }

  /**
   * Remove an Existing Quick Access
   * @param data
   * @returns
   */
  @Mutation(() => CustomerTimelineEntity, {
    name: 'removeCustomerTimeline',
  })
  public async remove(
    @Args('data')
    data: CustomerTimelineRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
