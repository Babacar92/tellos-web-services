import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { DepartmentEntity } from '../../../entities/psql/DepartmentEntity';
import { CurrentUser } from '../../../libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from '../../../libs/auth/dto/interfaces/user.payload.interface';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { dump } from '../../../utils/utils';
import { DepartmentCreateArgInput } from '../dto/args/department.create.arg.input';
import { DepartmentFilterArgInput } from '../dto/args/department.filter.arg.input';
import { DepartmentRemoveArgInput } from '../dto/args/department.remove.arg.input';
import { DepartmentUpdateArgInput } from '../dto/args/department.update.arg.input';
import { DepartmentPaginationResultInterface } from '../dto/interfaces/department.pagination.result.interface';
import { DepartmentService } from '../services/department.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

/**
 * The Quick Access Resolver
 */
@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class DepartmentResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: DepartmentService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => DepartmentEntity, {
        name: 'findAllDepartments'
    })
    public async findAllDepartments(
        @Args('filter')
        filter: DepartmentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DepartmentPaginationResultInterface> {

        return this._service.findDepartmentAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => DepartmentEntity, {
        name: 'findOneDepartment',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<DepartmentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => DepartmentEntity, {
        name: 'createDepartment'
    })
    public async create(
        @Args('data')
        data: DepartmentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DepartmentEntity> {

        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => DepartmentEntity, {
        name: 'updateDepartment'
    })
    public async update(
        @Args('data')
        data: DepartmentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<DepartmentEntity> {

        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => DepartmentEntity, {
        name: 'removeDepartment'
    })
    public async remove(
        @Args('data')
        data: DepartmentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
