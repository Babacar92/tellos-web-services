import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WorkUnitEntity } from 'src/entities/psql/WorkUnitEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { WorkUnitCreateArgInput } from '../dto/args/work-unit.create.arg.input';
import { WorkUnitFilterArgInput } from '../dto/args/work-unit.filter.arg.input';
import { WorkUnitRemoveArgInput } from '../dto/args/work-unit.remove.arg.input';
import { WorkUnitUpdateArgInput } from '../dto/args/work-unit.update.arg.input';
import { WorkUnitPaginationResultInterface } from '../dto/interfaces/work-unit.pagination.result.interface';
import { WorkUnitService } from '../service/work-unit.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class WorkUnitResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: WorkUnitService) {}

  /**
   * Return all Work Unit with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => WorkUnitEntity, {
    name: 'findAllWorkUnits',
  })
  public async findAllWorkUnits(
    @Args('filter')
    filter: WorkUnitFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<WorkUnitPaginationResultInterface> {
    return this._service.findWorkUnitsAndPaginationAll(
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
  @Query(() => WorkUnitEntity, {
    name: 'findOneWorkUnit',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<WorkUnitEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => WorkUnitEntity, {
    name: 'createWorkUnit',
  })
  public async create(
    @Args('data')
    data: WorkUnitCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<WorkUnitEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => WorkUnitEntity, {
    name: 'updateWorkUnit',
  })
  public async update(
    @Args('data')
    data: WorkUnitUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<WorkUnitEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Work Unit
   * @param data
   * @returns
   */
  @Mutation(() => WorkUnitEntity, {
    name: 'removeWorkUnit',
  })
  public async remove(
    @Args('data')
    data: WorkUnitRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
