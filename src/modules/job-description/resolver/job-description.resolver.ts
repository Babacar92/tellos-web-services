import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobDescriptionEntity } from 'src/entities/psql/JobDescriptionEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { JobDescriptionCreateArgInput } from '../dto/args/job-description.create.arg.input';
import { JobDescriptionFilterArgInput } from '../dto/args/job-description.filter.arg.input';
import { JobDescriptionRemoveArgInput } from '../dto/args/job-description.remove.arg.input';
import { JobDescriptionUpdateArgInput } from '../dto/args/job-description.update.arg.input';
import { JobDescriptionPaginationResultInterface } from '../dto/interfaces/job-description.pagination.result.interface';
import { JobDescriptionService } from '../service/job-description.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class JobDescriptionResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: JobDescriptionService,
    ) { }

    /**
     * Return all Job Description with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => JobDescriptionEntity, {
        name: 'findAllJobDescriptions'
    })
    public async findAllJobDescriptions(
        @Args('filter')
        filter: JobDescriptionFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<JobDescriptionPaginationResultInterface> {

        return this._service.findJobDescriptionAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Job Description
     * @param id 
     * @returns 
     */
    @Query(() => JobDescriptionEntity, {
        name: 'findOneJobDescription',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<JobDescriptionEntity> {
        return this._service.findOne(id);
    }

    

    /**
     * Create new Job Description
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => JobDescriptionEntity, {
        name: 'createJobDescription'
    })
    public async create(
        @Args('data')
        data: JobDescriptionCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<JobDescriptionEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Job Description
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => JobDescriptionEntity, {
        name: 'updateJobDescription'
    })
    public async update(
        @Args('data')
        data: JobDescriptionUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<JobDescriptionEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Job Description
     * @param data 
     * @returns 
     */
    @Mutation(() => JobDescriptionEntity, {
        name: 'removeJobDescription'
    })
    public async remove(
        @Args('data')
        data: JobDescriptionRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
