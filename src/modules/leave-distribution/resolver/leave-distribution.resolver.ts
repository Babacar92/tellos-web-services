import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LeaveDistributionEntity } from 'src/entities/psql/LeaveDistributionEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { LeaveDistributionCreateArgInput } from '../dto/args/leave-distribution.create.arg.input';
import { LeaveDistributionFilterArgInput } from '../dto/args/leave-distribution.filter.arg.input';
import { LeaveDistributionRemoveArgInput } from '../dto/args/leave-distribution.remove.arg.input';
import { LeaveDistributionUpdateArgInput } from '../dto/args/leave-distribution.update.arg.input';
import { LeaveDistributionPaginationResultInterface } from '../dto/interfaces/leave-distribution.pagination.result.interface';
import { LeaveDistributionService } from '../service/leave-distribution.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class LeaveDistributionResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: LeaveDistributionService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => LeaveDistributionEntity, {
        name: 'findAllLeaveDistributions'
    })
    public async findAllQualificationsTypes(
        @Args('filter')
        filter: LeaveDistributionFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LeaveDistributionPaginationResultInterface> {

        return this._service.findLeaveDistributionAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => LeaveDistributionEntity, {
        name: 'findOneLeaveDistribution',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<LeaveDistributionEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => LeaveDistributionEntity, {
        name: 'createLeaveDistribution'
    })
    public async create(
        @Args('data')
        data: LeaveDistributionCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LeaveDistributionEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => LeaveDistributionEntity, {
        name: 'updateLeaveDistribution'
    })
    public async update(
        @Args('data')
        data: LeaveDistributionUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LeaveDistributionEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => LeaveDistributionEntity, {
        name: 'removeLeaveDistribution'
    })
    public async remove(
        @Args('data')
        data: LeaveDistributionRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
