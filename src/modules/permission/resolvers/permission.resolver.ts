import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { CurrentUser } from '../../../libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from '../../../libs/auth/dto/interfaces/user.payload.interface';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { PermissionFilterArgInput } from '../dto/args/permission.filter.arg.input';
import { PermissionPaginationResultInterface } from '../dto/interfaces/permission.pagination.result.interface';
import { PermissionService } from '../services/permission.service';
import { PermissionEntity } from 'src/entities/psql/PermissionEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { dump } from '../../../utils/utils';

/**
 * The Permossions Resolver
 */
@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class PermissionResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: PermissionService,
    ) { }

    /**
     * Return all permossions with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => PermissionEntity, {
        name: 'findAllPermissions'
    })
    public async findAllPermissions(
        @Args('filter')
        filter: PermissionFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<PermissionPaginationResultInterface> {

        return this._service.findPermissionAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Permossions
     * @param id 
     * @returns 
     */
    @Query(() => PermissionEntity, {
        name: 'findOnePermission',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<PermissionEntity> {
        return this._service.findOne(id);
    }

}
