import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExpensePostEntity } from 'src/entities/psql/ExpensePostEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ExpensePostCreateArgInput } from '../dto/args/expense-post.create.arg.input';
import { ExpensePostFilterArgInput } from '../dto/args/expense-post.filter.arg.input';
import { ExpensePostRemoveArgInput } from '../dto/args/expense-post.remove.arg.input';
import { ExpensePostUpdateArgInput } from '../dto/args/expense-post.update.arg.input';
import { ExpensePostPaginationResultInterface } from '../dto/interfaces/expense-post.pagination.result.interface';
import { ExpensePostService } from '../service/expense-post.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { dump } from '../../../utils/utils';
import { SectionCodeIntoExpensePostArgInput } from '../dto/args/section.code.into.expense.post.arg.input';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class ExpensePostResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: ExpensePostService) {}

  /**
   * Return all ExpensePost with pagination
   * @param filter
   * @param user
   * @returns
   */
  @Query(() => ExpensePostEntity, {
    name: 'findAllExpensePosts',
  })
  public async findAllExpensePosts(
    @Args('filter')
    filter: ExpensePostFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ExpensePostPaginationResultInterface> {
    return this._service.findExpensePostAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One ExpensePost
   * @param id
   * @returns
   */
  @Query(() => ExpensePostEntity, {
    name: 'findOneExpensePost',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<ExpensePostEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new ExpensePost
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => ExpensePostEntity, {
    name: 'createExpensePost',
  })
  public async create(
    @Args('data')
    data: ExpensePostCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ExpensePostEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing ExpensePost
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => ExpensePostEntity, {
    name: 'updateExpensePost',
  })
  public async update(
    @Args('data')
    data: ExpensePostUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ExpensePostEntity> {
    return this._service.update(data);
  }

  /**
   *
   * @param data
   * @param user
   */
  @Mutation(() => ExpensePostEntity, {
    name: 'addSectionCodeIntoExpensePost',
  })
  public async addSectionCodeIntoExpensePost(
    @Args('data')
    data: SectionCodeIntoExpensePostArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<ExpensePostEntity> {
    return this._service.addSectionCodeIntoExpensePost(data);
  }

  /**
   * Remove an Existing ExpensePost
   * @param data
   * @returns
   */
  @Mutation(() => ExpensePostEntity, {
    name: 'removeExpensePost',
  })
  public async remove(
    @Args('data')
    data: ExpensePostRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
