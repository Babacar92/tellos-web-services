import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessBatchStatusEntity } from 'src/entities/psql/BusinessBatchStatusEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessBatchStatusCreateArgInput } from '../dto/args/business-batch-status.create.arg.input';
import { BusinessBatchStatusFilterArgInput } from '../dto/args/business-batch-status.filter.arg.input';
import { BusinessBatchStatusRemoveArgInput } from '../dto/args/business-batch-status.remove.arg.input';
import { BusinessBatchStatusUpdateArgInput } from '../dto/args/business-batch-status.update.arg.input';
import { BusinessBatchStatusPaginationResultInterface } from '../dto/interfaces/business-batch-status.pagination.result.interface';
import { BusinessBatchStatusService } from '../service/business-batch-status.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessBatchStatusResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessBatchStatusService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessBatchStatusEntity, {
        name: 'findAllBusinessBatchStatuses'
    })
    public async findAllBusinessBatchStatuses(
        @Args('filter')
        filter: BusinessBatchStatusFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBatchStatusPaginationResultInterface> {

        return this._service.findBusinessBatchStatussAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessBatchStatusEntity, {
        name: 'findOneBusinessBatchStatus',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessBatchStatusEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessBatchStatusEntity, {
        name: 'createBusinessBatchStatus'
    })
    public async create(
        @Args('data')
        data: BusinessBatchStatusCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBatchStatusEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessBatchStatusEntity, {
        name: 'updateBusinessBatchStatus'
    })
    public async update(
        @Args('data')
        data: BusinessBatchStatusUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBatchStatusEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessBatchStatusEntity, {
        name: 'removeBusinessBatchStatus'
    })
    public async remove(
        @Args('data')
        data: BusinessBatchStatusRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
