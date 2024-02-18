import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EquipmentTechnicalGenre } from 'src/entities/psql/equipment-technical-genre.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentTechnicalGenreCreateArgInput } from './dto/args/equipment-technical-genre.create.arg.input';
import { EquipmentTechnicalGenreFilterArgInput } from './dto/args/equipment-technical-genre.filter.arg.input';
import { EquipmentTechnicalGenreRemoveArgInput } from './dto/args/equipment-technical-genre.remove.arg.input';
import { EquipmentTechnicalGenreUpdateArgInput } from './dto/args/equipment-technical-genre.update.arg.input';
import { EquipmentTechnicalGenrePaginationResultInterface } from './dto/interfaces/equipment-technical-genre.pagination.result.interface';
import { EquipmentTechnicalGenreService } from './equipment-technical-genre.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EquipmentTechnicalGenreResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: EquipmentTechnicalGenreService) {}

  /**
   * Return all Work Unit with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => EquipmentTechnicalGenre, {
    name: 'findAllEquipmentTechnicalGenres',
  })
  public async findAllEquipmentTechnicalGenres(
    @Args('filter')
    filter: EquipmentTechnicalGenreFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentTechnicalGenrePaginationResultInterface> {
    return this._service.findEquipmentTechnicalGenresAndPaginationAll(
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
  @Query(() => EquipmentTechnicalGenre, {
    name: 'findOneEquipmentTechnicalGenre',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<EquipmentTechnicalGenre> {
    return this._service.findOne(id);
  }

  /**
   * Create new Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentTechnicalGenre, {
    name: 'createEquipmentTechnicalGenre',
  })
  public async create(
    @Args('data')
    data: EquipmentTechnicalGenreCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentTechnicalGenre> {
    return this._service.create(data);
  }

  /**
   * Update an existing Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => EquipmentTechnicalGenre, {
    name: 'updateEquipmentTechnicalGenre',
  })
  public async update(
    @Args('data')
    data: EquipmentTechnicalGenreUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<EquipmentTechnicalGenre> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Work Unit
   * @param data
   * @returns
   */
  @Mutation(() => EquipmentTechnicalGenre, {
    name: 'removeEquipmentTechnicalGenre',
  })
  public async remove(
    @Args('data')
    data: EquipmentTechnicalGenreRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
