import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InseeCodeEntity } from 'src/entities/psql/InseeCodeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { InseeCodeCreateArgInput } from '../dto/args/insee-code.create.arg.input';
import { InseeCodeFilterArgInput } from '../dto/args/insee-code.filter.arg.input';
import { InseeCodeRemoveArgInput } from '../dto/args/insee-code.remove.arg.input';
import { InseeCodeUpdateArgInput } from '../dto/args/insee-code.update.arg.input';
import { InseeCodePaginationResultInterface } from '../dto/interfaces/insee-code.pagination.result.interface';
import { InseeCodeService } from '../service/insee-code.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class InseeCodeResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: InseeCodeService) {}

  /**
   * Return all Work Unit with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param user
   * @returns
   */
  @Query(() => InseeCodeEntity, {
    name: 'findAllInseeCodes',
  })
  public async findAllInseeCodes(
    @Args('filter')
    filter: InseeCodeFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<InseeCodePaginationResultInterface> {
    return this._service.findInseeCodesAndPaginationAll(
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
  @Query(() => InseeCodeEntity, {
    name: 'findOneInseeCode',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<InseeCodeEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => InseeCodeEntity, {
    name: 'createInseeCode',
  })
  public async create(
    @Args('data')
    data: InseeCodeCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<InseeCodeEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Work Unit
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => InseeCodeEntity, {
    name: 'updateInseeCode',
  })
  public async update(
    @Args('data')
    data: InseeCodeUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<InseeCodeEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Work Unit
   * @param data
   * @returns
   */
  @Mutation(() => InseeCodeEntity, {
    name: 'removeInseeCode',
  })
  public async remove(
    @Args('data')
    data: InseeCodeRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
