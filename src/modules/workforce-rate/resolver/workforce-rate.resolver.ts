import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WorkforceRateEntity } from 'src/entities/psql/WorkforceRateEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { WorkforceRateCreateArgInput } from '../dto/args/workforce-rate.create.arg.input';
import { WorkforceRateFilterArgInput } from '../dto/args/workforce-rate.filter.arg.input';
import { WorkforceRateRemoveArgInput } from '../dto/args/workforce-rate.remove.arg.input';
import { WorkforceRateUpdateArgInput } from '../dto/args/workforce-rate.update.arg.input';
import { WorkforceRatePaginationResultInterface } from '../dto/interfaces/workforce-rate.pagination.result.interface';
import { WorkforceRateService } from '../service/workforce-rate.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class WorkforceRateResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: WorkforceRateService) {}

  /**
   * Return all Workforce Rate with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => WorkforceRateEntity, {
    name: 'findAllWorkforceRates',
  })
  public async findAllWorkforceRates(
    @Args('filter')
    filter: WorkforceRateFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<WorkforceRatePaginationResultInterface> {
    return this._service.findWorkforceRatesAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One Workforce Rate
   * @param id
   * @returns
   */
  @Query(() => WorkforceRateEntity, {
    name: 'findOneWorkforceRate',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<WorkforceRateEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Workforce Rate
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => WorkforceRateEntity, {
    name: 'createWorkforceRate',
  })
  public async create(
    @Args('data')
    data: WorkforceRateCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<WorkforceRateEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Workforce Rate
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => WorkforceRateEntity, {
    name: 'updateWorkforceRate',
  })
  public async update(
    @Args('data')
    data: WorkforceRateUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<WorkforceRateEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Workforce Rate
   * @param data
   * @returns
   */
  @Mutation(() => WorkforceRateEntity, {
    name: 'removeWorkforceRate',
  })
  public async remove(
    @Args('data')
    data: WorkforceRateRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
