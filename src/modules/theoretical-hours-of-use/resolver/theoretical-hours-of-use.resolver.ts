import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TheoreticalHoursOfUseEntity } from 'src/entities/psql/TheoreticalHoursOfUseEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { TheoreticalHoursOfUseCreateArgInput } from '../dto/args/theoretical-hours-of-use.create.arg.input';
import { TheoreticalHoursOfUseFilterArgInput } from '../dto/args/theoretical-hours-of-use.filter.arg.input';
import { TheoreticalHoursOfUseRemoveArgInput } from '../dto/args/theoretical-hours-of-use.remove.arg.input';
import { TheoreticalHoursOfUseUpdateArgInput } from '../dto/args/theoretical-hours-of-use.update.arg.input';
import { TheoreticalHoursOfUsePaginationResultInterface } from '../dto/interfaces/theoretical-hours-of-use.pagination.result.interface';
import { TheoreticalHoursOfUseService } from '../service/theoretical-hours-of-use.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class TheoreticalHoursOfUseResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: TheoreticalHoursOfUseService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => TheoreticalHoursOfUseEntity, {
        name: 'findAllTheoreticalHoursOfUses'
    })
    public async findAllQualificationsNames(
        @Args('filter')
        filter: TheoreticalHoursOfUseFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<TheoreticalHoursOfUsePaginationResultInterface> {

        return this._service.findTheoreticalHoursOfUsesAndPaginationAll(filter, sort, pagination);
    }


    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => TheoreticalHoursOfUseEntity, {
        name: 'findOneTheoreticalHoursOfUse',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<TheoreticalHoursOfUseEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => TheoreticalHoursOfUseEntity, {
        name: 'createTheoreticalHoursOfUse'
    })
    public async create(
        @Args('data')
        data: TheoreticalHoursOfUseCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<TheoreticalHoursOfUseEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => TheoreticalHoursOfUseEntity, {
        name: 'updateTheoreticalHoursOfUse'
    })
    public async update(
        @Args('data')
        data: TheoreticalHoursOfUseUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<TheoreticalHoursOfUseEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => TheoreticalHoursOfUseEntity, {
        name: 'removeTheoreticalHoursOfUse'
    })
    public async remove(
        @Args('data')
        data: TheoreticalHoursOfUseRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
