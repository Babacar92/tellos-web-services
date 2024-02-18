import { UseGuards } from '@nestjs/common';
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ConstructionSiteCreateArgInput } from './dto/args/construction-site-create.arg.input';
import { ConstructionSiteService } from './construction-site.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { ConstructionSite } from '@/entities/psql/construction-site.entity';
import { ConstructionSiteFilterArgInput } from './dto/args/construction-site.filter.arg.input';
import { ConstructionSiteUpdateArgInput } from './dto/args/construction-site.update.arg.input';
import { ConstructionSiteRemoveArgInput } from './dto/args/construction-site.remove.arg.input';
import { PaginatedResult } from '@/libs/databases/dto/interfaces/result.pagination.interface';
import { EntityEntity } from '@/entities/psql/EntityEntity';

//Librairies
import Dataloader from 'dataloader';
import { Employee } from '@/entities/psql/EmployeeEntity';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => ConstructionSite)
export class ContructionSiteResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: ConstructionSiteService) {}

    /**
     * Return all construction sites with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => ConstructionSite, {
        name: 'findAllConstructionSites',
    })
    public async findAllConstructionSites(
        @Args('filter')
        filter: ConstructionSiteFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<PaginatedResult<ConstructionSite>> {
        return this._service.findConstructionSiteAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Work Unit
     * @param id
     * @returns
     */
    @Query(() => ConstructionSite, {
        name: 'findOneConstructionSite',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<ConstructionSite> {
        return this._service.findOne(id);
    }

    /**
     * Create new Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ConstructionSite, {
        name: 'createConstructionSite',
    })
    public async create(
        @Args('data')
        data: ConstructionSiteCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ConstructionSite> {
        return this._service.create(data);
    }

    /**
     * Update an existing Construction Site
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ConstructionSite, {
        name: 'updateConstructionSite',
    })
    public async update(
        @Args('data')
        data: ConstructionSiteUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ConstructionSite> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Work Unit
     * @param data
     * @returns
     */
    @Mutation(() => ConstructionSite, {
        name: 'removeConstructionSite',
    })
    public async remove(
        @Args('data')
        data: ConstructionSiteRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    @ResolveField('entity', (returns) => EntityEntity)
    async entity(
        @Parent() parent: ConstructionSite,
        @Context('entityLoader')
        entityLoader: Dataloader<number, EntityEntity>,
    ): Promise<EntityEntity> {
        return entityLoader.load(parent.entity_id);
    }

    @ResolveField('riskFrom', (returns) => Employee)
    async riskFrom(
        @Parent() parent: ConstructionSite,
        @Context('employeeLoader')
        employeeLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        return parent.risk_from_id
            ? employeeLoader.load(parent.risk_from_id)
            : null;
    }

    @ResolveField('from', (returns) => ConstructionSite)
    async from(
        @Parent() parent: ConstructionSite,
        @Context('constructionSiteLoader')
        constructionSiteLoader: Dataloader<number, ConstructionSite>,
    ): Promise<ConstructionSite> {
        return parent.from_id
            ? constructionSiteLoader.load(parent.from_id)
            : null;
    }
}
