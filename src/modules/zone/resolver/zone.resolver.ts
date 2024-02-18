import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ZoneEntity } from 'src/entities/psql/ZoneEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ZoneCreateArgInput } from '../dto/args/zone.create.arg.input';
import { ZoneFilterArgInput } from '../dto/args/zone.filter.arg.input';
import { ZoneRemoveArgInput } from '../dto/args/zone.remove.arg.input';
import { ZoneUpdateArgInput } from '../dto/args/zone.update.arg.input';
import { ZonePaginationResultInterface } from '../dto/interfaces/zone.pagination.result.interface';
import { ZoneService } from '../service/zone.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class ZoneResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: ZoneService) {}

  /**
   * Return all Zone with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => ZoneEntity, {
    name: 'findAllZones',
  })
  public async findAllZones(
    @Args('filter')
    filter: ZoneFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ZonePaginationResultInterface> {
    return this._service.findZonesAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One Zone
   * @param id
   * @returns
   */
  @Query(() => ZoneEntity, {
    name: 'findOneZone',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<ZoneEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Zone
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => ZoneEntity, {
    name: 'createZone',
  })
  public async create(
    @Args('data')
    data: ZoneCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ZoneEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Zone
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => ZoneEntity, {
    name: 'updateZone',
  })
  public async update(
    @Args('data')
    data: ZoneUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ZoneEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Zone
   * @param data
   * @returns
   */
  @Mutation(() => ZoneEntity, {
    name: 'removeZone',
  })
  public async remove(
    @Args('data')
    data: ZoneRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
