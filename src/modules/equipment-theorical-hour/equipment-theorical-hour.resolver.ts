import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EquipmentTheoricalHour } from 'src/entities/psql/equipment-theorical-hour.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentTheoricalHourCreateArgInput } from './dto/args/equipment-theorical-hour.create.arg.input';
import { EquipmentTheoricalHourFilterArgInput } from './dto/args/equipment-theorical-hour.filter.arg.input';
import { EquipmentTheoricalHourRemoveArgInput } from './dto/args/equipment-theorical-hour.remove.arg.input';
import { EquipmentTheoricalHourUpdateArgInput } from './dto/args/equipment-theorical-hour.update.arg.input';
import { EquipmentTheoricalHourPaginationResultInterface } from './dto/interfaces/equipment-theorical-hour.pagination.result.interface';
import { EquipmentTheoricalHourService } from './equipment-theorical-hour.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EquipmentTheoricalHourResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: EquipmentTheoricalHourService) {}

  /**
   * Return all Work Unit with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => EquipmentTheoricalHour, {
    name: 'findAllEquipmentTheoricalHours',
  })
  public async findAllEquipmentTheoricalHours(
    @Args('filter')
    filter: EquipmentTheoricalHourFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentTheoricalHourPaginationResultInterface> {
    return this._service.findEquipmentTheoricalHoursAndPaginationAll(
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
  @Query(() => EquipmentTheoricalHour, {
    name: 'findOneEquipmentTheoricalHour',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<EquipmentTheoricalHour> {
    return this._service.findOne(id);
  }

  /**
   * Create new Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentTheoricalHour, {
    name: 'createEquipmentTheoricalHour',
  })
  public async create(
    @Args('data')
    data: EquipmentTheoricalHourCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentTheoricalHour> {
    return this._service.create(data);
  }

  /**
   * Update an existing Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentTheoricalHour, {
    name: 'updateEquipmentTheoricalHour',
  })
  public async update(
    @Args('data')
    data: EquipmentTheoricalHourUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentTheoricalHour> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Work Unit
   * @param data
   * @returns
   */
  @Mutation(() => EquipmentTheoricalHour, {
    name: 'removeEquipmentTheoricalHour',
  })
  public async remove(
    @Args('data')
    data: EquipmentTheoricalHourRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
