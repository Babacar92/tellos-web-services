import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QualificationEntity } from 'src/entities/psql/QualificationEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { QualificationCreateArgInput } from '../dto/args/qualification.create.arg.input';
import { QualificationFilterArgInput } from '../dto/args/qualification.filter.arg.input';
import { QualificationRemoveArgInput } from '../dto/args/qualification.remove.arg.input';
import { QualificationUpdateArgInput } from '../dto/args/qualification.update.arg.input';
import { QualificationPaginationResultInterface } from '../dto/interfaces/qualification.pagination.result.interface';
import { QualificationService } from '../service/qualification.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { QualificationStatusEnum } from '../dto/enums/qualification.status.enum';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class QualificationResolver {
  /**
   * The constructor
   * @param _service
   */
  public constructor(private readonly _service: QualificationService) {}

  /**
   * Return all quick access with pagination
   * @param filter
   * @param user
   * @returns
   */
  @Query(() => QualificationEntity, {
    name: 'findAllQualifications',
  })
  public async findAllQualifications(
    @Args('filter')
    filter: QualificationFilterArgInput,
    @Args('sort')
    sort: DatabaseSortArg,
    @Args('pagination')
    pagination: PaginationArg,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<QualificationPaginationResultInterface> {
    return this._service.findQualificationsAndPaginationAll(
      filter,
      sort,
      pagination,
    );
  }

  /**
   * Return One Quick Access
   * @param id
   * @returns
   */
  @Query(() => QualificationEntity, {
    name: 'findOneQualification',
  })
  public async findOne(
    @Args('id')
    id: number,
  ): Promise<QualificationEntity> {
    return this._service.findOne(id);
  }

  /**
   * Create new Quick Access
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => QualificationEntity, {
    name: 'createQualification',
  })
  public async create(
    @Args('data')
    data: QualificationCreateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<QualificationEntity> {
    return this._service.create(data);
  }

  /**
   * Update an existing Quick Access
   * @param data
   * @param user
   * @returns
   */
  @Mutation(() => QualificationEntity, {
    name: 'updateQualification',
  })
  public async update(
    @Args('data')
    data: QualificationUpdateArgInput,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<QualificationEntity> {
    return this._service.update(data);
  }

  /**
   * Update an existing Quick Access
   * @param id
   * @param user
   * @returns
   */
  @Mutation(() => QualificationEntity, {
    name: 'validateQualification',
  })
  public async validateQualification(
    @Args('id')
    id: number,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<QualificationEntity> {
    return this._service.update({
      id: id,
      status: QualificationStatusEnum.VALIDATED,
    });
  }

  /**
   * Update an existing Quick Access
   * @param id
   * @param user
   * @returns
   */
  @Mutation(() => QualificationEntity, {
    name: 'unValidateQualification',
  })
  public async unValidateQualification(
    @Args('id')
    id: number,
    @CurrentUser()
    user: UserPayloadInterface,
  ): Promise<QualificationEntity> {
    return this._service.update({
      id: id,
      status: QualificationStatusEnum.REFUSED,
    });
  }

  /**
   * Remove an Existing Quick Access
   * @param data
   * @returns
   */
  @Mutation(() => QualificationEntity, {
    name: 'removeQualification',
  })
  public async remove(
    @Args('data')
    data: QualificationRemoveArgInput,
  ): Promise<boolean> {
    return this._service.remove(data);
  }
}
