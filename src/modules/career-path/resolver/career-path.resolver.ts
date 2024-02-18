import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CareerPathCreateArgInput } from '../dto/args/career-path.create.arg.input';
import { CareerPathFilterArgInput } from '../dto/args/career-path.filter.arg.input';
import { CareerPathRemoveArgInput } from '../dto/args/career-path.remove.arg.input';
import { CareerPathUpdateArgInput } from '../dto/args/career-path.update.arg.input';
import { CareerPathPaginationResultInterface } from '../dto/interfaces/career-path.pagination.result.interface';
import { CareerPathService } from '../service/career-path.service';
import { CareerPathEntity } from 'src/entities/psql/CareerPathEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class CareerPathResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: CareerPathService,
    ) { }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => CareerPathEntity, {
        name: 'careerPathTimelineCountByType',
    })
    public async careerPathTimelineCountByType(

    ): Promise<{ [key: string]: number }> {
        return this._service.countByType();
    }

    /**
     * Return all Career Path with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => CareerPathEntity, {
        name: 'findAllCareerPaths'
    })
    public async findAllCareerPath(
        @Args('filter')
        filter: CareerPathFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CareerPathPaginationResultInterface> {
        return this._service.findCareerPathAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Career Path
     * @param id 
     * @returns 
     */
    @Query(() => CareerPathEntity, {
        name: 'findOneCareerPath',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<CareerPathEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Career Path 
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CareerPathEntity, {
        name: 'createCareerPath'
    })
    public async create(
        @Args('data')
        data: CareerPathCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CareerPathEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Career Path
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => CareerPathEntity, {
        name: 'updateCareerPath'
    })
    public async update(
        @Args('data')
        data: CareerPathUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CareerPathEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Career Path
     * @param data 
     * @returns 
     */
    @Mutation(() => CareerPathEntity, {
        name: 'removeCareerPath'
    })
    public async remove(
        @Args('data')
        data: CareerPathRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
