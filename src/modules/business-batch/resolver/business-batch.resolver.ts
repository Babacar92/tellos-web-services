import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessBatchEntity } from 'src/entities/psql/BusinessBatchEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessBatchCreateArgInput } from '../dto/args/business-batch.create.arg.input';
import { BusinessBatchFilterArgInput } from '../dto/args/business-batch.filter.arg.input';
import { BusinessBatchRemoveArgInput } from '../dto/args/business-batch.remove.arg.input';
import { BusinessBatchUpdateArgInput } from '../dto/args/business-batch.update.arg.input';
import { BusinessBatchPaginationResultInterface } from '../dto/interfaces/business-batch.pagination.result.interface';
import { BusinessBatchService } from '../service/business-batch.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessBatchResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessBatchService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessBatchEntity, {
        name: 'findAllBusinessBatches'
    })
    public async findAllBusinessBatches(
        @Args('filter')
        filter: BusinessBatchFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBatchPaginationResultInterface> {

        return this._service.findBusinessBatchsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessBatchEntity, {
        name: 'findOneBusinessBatch',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessBatchEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessBatchEntity, {
        name: 'createBusinessBatch'
    })
    public async create(
        @Args('data')
        data: BusinessBatchCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBatchEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessBatchEntity, {
        name: 'updateBusinessBatch'
    })
    public async update(
        @Args('data')
        data: BusinessBatchUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessBatchEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessBatchEntity, {
        name: 'removeBusinessBatch'
    })
    public async remove(
        @Args('data')
        data: BusinessBatchRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
