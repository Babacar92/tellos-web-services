import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EquipmentRateEntity } from 'src/entities/psql/EquipmentRateEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentRateCreateArgInput } from '../dto/args/equipment-rate.create.arg.input';
import { EquipmentRateFilterArgInput } from '../dto/args/equipment-rate.filter.arg.input';
import { EquipmentRateRemoveArgInput } from '../dto/args/equipment-rate.remove.arg.input';
import { EquipmentRateUpdateArgInput } from '../dto/args/equipment-rate.update.arg.input';
import { EquipmentRatePaginationResultInterface } from '../dto/interfaces/equipment-rate.pagination.result.interface';
import { EquipmentRateService } from '../service/equipment-rate.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EquipmentRateResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: EquipmentRateService) {}

  /**
   * Return all Workforce Rate with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => EquipmentRateEntity, {
    name: 'findAllEquipmentRates',
  })
  public async findAllEquipmentRates(
    @Args('filter')
    filter: EquipmentRateFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentRatePaginationResultInterface> {
    return this._service.findEquipmentRatesAndPaginationAll(
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
  @Query(() => EquipmentRateEntity, {
    name: 'findOneEquipmentRate',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<EquipmentRateEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Workforce Rate
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentRateEntity, {
    name: 'createEquipmentRate',
  })
  public async create(
    @Args('data')
    data: EquipmentRateCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentRateEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Workforce Rate
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentRateEntity, {
    name: 'updateEquipmentRate',
  })
  public async update(
    @Args('data')
    data: EquipmentRateUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentRateEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Workforce Rate
   * @param data
   * @returns
   */
  @Mutation(() => EquipmentRateEntity, {
    name: 'removeEquipmentRate',
  })
  public async remove(
    @Args('data')
    data: EquipmentRateRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
