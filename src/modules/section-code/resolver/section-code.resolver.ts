import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SectionCodeEntity } from 'src/entities/psql/SectionCodeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { SectionCodeCreateArgInput } from '../dto/args/section-code.create.arg.input';
import { SectionCodeFilterArgInput } from '../dto/args/section-code.filter.arg.input';
import { SectionCodeRemoveArgInput } from '../dto/args/section-code.remove.arg.input';
import { SectionCodeUpdateArgInput } from '../dto/args/section-code.update.arg.input';
import { SectionCodePaginationResultInterface } from '../dto/interfaces/section-code.pagination.result.interface';
import { SectionCodeService } from '../service/section-code.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class SectionCodeResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: SectionCodeService) {}

  /**
   * Return all Section Code with pagination
   * @param filter
   * @param user
   * @returns
   */
  @Query(() => SectionCodeEntity, {
    name: 'findAllSectionCodes',
  })
  public async findAllSectionCodes(
    @Args('filter')
    filter: SectionCodeFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<SectionCodePaginationResultInterface> {
    return this._service.findSectionCodeAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return all Section Code with pagination
   * @param filter
   * @param user
   * @returns
   */
  @Query(() => SectionCodeEntity, {
    name: 'findAllSectionCodesForWorkforceRate',
  })
  public async findAllSectionCodesForWorkforceRate(
    @Args('filter')
    filter: SectionCodeFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<SectionCodePaginationResultInterface> {
    return this._service.findAllSectionCodesForWorkforceRate(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One Section Code
   * @param id
   * @returns
   */
  @Query(() => SectionCodeEntity, {
    name: 'findOneSectionCode',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<SectionCodeEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Section Code
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => SectionCodeEntity, {
    name: 'createSectionCode',
  })
  public async create(
    @Args('data')
    data: SectionCodeCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<SectionCodeEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Section Code
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => SectionCodeEntity, {
    name: 'updateSectionCode',
  })
  public async update(
    @Args('data')
    data: SectionCodeUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<SectionCodeEntity> {
    return this._service.update(data);
  }

  /**
   * Remove an Existing Section Code
   * @param data
   * @returns
   */
  @Mutation(() => SectionCodeEntity, {
    name: 'removeSectionCode',
  })
  public async remove(
    @Args('data')
    data: SectionCodeRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }

  @Mutation(() => SectionCodeEntity, {
    name: 'removeExpensePostInSectionCode',
  })
  public async removeExpensePostInSectionCode(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return this._service.removeExpensePost(id);
  }
}
