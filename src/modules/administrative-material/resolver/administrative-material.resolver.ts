import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdministrativeMaterialEntity } from 'src/entities/psql/AdministrativeMaterialEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { AdministrativeMaterialCreateArgInput } from '../dto/args/administrative-material.create.arg.input';
import { AdministrativeMaterialFilterArgInput } from '../dto/args/administrative-material.filter.arg.input';
import { AdministrativeMaterialRemoveArgInput } from '../dto/args/administrative-material.remove.arg.input';
import { AdministrativeMaterialUpdateArgInput } from '../dto/args/administrative-material.update.arg.input';
import { AdministrativeMaterialPaginationResultInterface } from '../dto/interfaces/administrative-material.pagination.result.interface';
import { AdministrativeMaterialService } from '../service/administrative-material.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class AdministrativeMaterialResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: AdministrativeMaterialService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => AdministrativeMaterialEntity, {
        name: 'findAllAdministrativeMaterials'
    })
    public async findAllQualificationsTypes(
        @Args('filter')
        filter: AdministrativeMaterialFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<AdministrativeMaterialPaginationResultInterface> {

        return this._service.findAdministrativeMaterialsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => AdministrativeMaterialEntity, {
        name: 'findOneAdministrativeMaterial',
    })
    public async findOne(
        @Args("id") id: number,
    ): Promise<AdministrativeMaterialEntity> {

        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => AdministrativeMaterialEntity, {
        name: 'createAdministrativeMaterial'
    })
    public async create(
        @Args('data')
        data: AdministrativeMaterialCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    )
        : Promise<AdministrativeMaterialEntity> {
        return this._service.create(data);

    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => AdministrativeMaterialEntity, {
        name: 'updateAdministrativeMaterial'
    })
    public async update(
        @Args('data')
        data: AdministrativeMaterialUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<AdministrativeMaterialEntity> {
        return this._service.update(data);
    }


    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => AdministrativeMaterialEntity, {
        name: 'removeAdministrativeMaterial'
    })
    public async remove(
        @Args('data')
        data: AdministrativeMaterialRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
