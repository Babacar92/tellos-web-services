import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MediumSizedCentreEntity } from 'src/entities/psql/MediumSizedCentreEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { MediumSizedCentreCreateArgInput } from '../dto/args/medium-sized-centre.create.arg.input';
import { MediumSizedCentreFilterArgInput } from '../dto/args/medium-sized-centre.filter.arg.input';
import { MediumSizedCentreRemoveArgInput } from '../dto/args/medium-sized-centre.remove.arg.input';
import { MediumSizedCentreUpdateArgInput } from '../dto/args/medium-sized-centre.update.arg.input';
import { MediumSizedCentrePaginationResultInterface } from '../dto/interfaces/medium-sized-centre.pagination.result.interface';
import { MediumSizedCentreService } from '../service/medium-sized-centre.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class MediumSizedCentreResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: MediumSizedCentreService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => MediumSizedCentreEntity, {
        name: 'findAllMediumSizedCentres'
    })
    public async findAllMediumSizedCentres(
        @Args('filter')
        filter: MediumSizedCentreFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<MediumSizedCentrePaginationResultInterface> {

        return this._service.findmediumSizedCentresAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => MediumSizedCentreEntity, {
        name: 'findOneMediumSizedCentre',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<MediumSizedCentreEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => MediumSizedCentreEntity, {
        name: 'createMediumSizedCentre'
    })
    public async create(
        @Args('data')
        data: MediumSizedCentreCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<MediumSizedCentreEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => MediumSizedCentreEntity, {
        name: 'updateMediumSizedCentre'
    })
    public async update(
        @Args('data')
        data: MediumSizedCentreUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<MediumSizedCentreEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => MediumSizedCentreEntity, {
        name: 'removeMediumSizedCentre'
    })
    public async remove(
        @Args('data')
        data: MediumSizedCentreRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
