import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EquipmentParkUnitEntity } from 'src/entities/psql/EquipmentParkUnitEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentParkUnitCreateArgInput } from '../dto/args/equipment-park-unit.create.arg.input';
import { EquipmentParkUnitFilterArgInput } from '../dto/args/equipment-park-unit.filter.arg.input';
import { EquipmentParkUnitRemoveArgInput } from '../dto/args/equipment-park-unit.remove.arg.input';
import { EquipmentParkUnitUpdateArgInput } from '../dto/args/equipment-park-unit.update.arg.input';
import { EquipmentParkUnitPaginationResultInterface } from '../dto/interfaces/equipment-park-unit.pagination.result.interface';
import { EquipmentParkUnitService } from '../service/equipment-park-unit.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EquipmentParkUnitResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: EquipmentParkUnitService) {}

  /**
   * Return all Work Unit with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => EquipmentParkUnitEntity, {
    name: 'findAllEquipmentParkUnits',
  })
  public async findAllEquipmentParkUnits(
    @Args('filter')
    filter: EquipmentParkUnitFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentParkUnitPaginationResultInterface> {
    return this._service.findEquipmentParkUnitsAndPaginationAll(
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
  @Query(() => EquipmentParkUnitEntity, {
    name: 'findOneEquipmentParkUnit',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<EquipmentParkUnitEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentParkUnitEntity, {
    name: 'createEquipmentParkUnit',
  })
  public async create(
    @Args('data')
    data: EquipmentParkUnitCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentParkUnitEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentParkUnitEntity, {
    name: 'updateEquipmentParkUnit',
  })
  public async update(
    @Args('data')
    data: EquipmentParkUnitUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentParkUnitEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Work Unit
   * @param data
   * @returns
   */
  @Mutation(() => EquipmentParkUnitEntity, {
    name: 'removeEquipmentParkUnit',
  })
  public async remove(
    @Args('data')
    data: EquipmentParkUnitRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
