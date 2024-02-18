import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QualificationTypeEntity } from 'src/entities/psql/QualificationTypeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { QualificationTypeCreateArgInput } from '../dto/args/qualification-type.create.arg.input';
import { QualificationTypeFilterArgInput } from '../dto/args/qualification-type.filter.arg.input';
import { QualificationTypeRemoveArgInput } from '../dto/args/qualification-type.remove.arg.input';
import { QualificationTypeUpdateArgInput } from '../dto/args/qualification-type.update.arg.input';
import { QualificationTypePaginationResultInterface } from '../dto/interfaces/qualification-type.pagination.result.interface';
import { QualificationTypeService } from '../service/qualification-type.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class QualificationTypeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: QualificationTypeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => QualificationTypeEntity, {
        name: 'findAllQualificationsTypes'
    })
    public async findAllQualificationsTypes(
        @Args('filter')
        filter: QualificationTypeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QualificationTypePaginationResultInterface> {

        return this._service.findQualificationTypesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => QualificationTypeEntity, {
        name: 'findOneQualificationType',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<QualificationTypeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => QualificationTypeEntity, {
        name: 'createQualificationType'
    })
    public async create(
        @Args('data')
        data: QualificationTypeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QualificationTypeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => QualificationTypeEntity, {
        name: 'updateQualificationType'
    })
    public async update(
        @Args('data')
        data: QualificationTypeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QualificationTypeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => QualificationTypeEntity, {
        name: 'removeQualificationType'
    })
    public async remove(
        @Args('data')
        data: QualificationTypeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
