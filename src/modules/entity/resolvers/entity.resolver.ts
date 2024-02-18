import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { CurrentUser } from '../../../libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from '../../../libs/auth/dto/interfaces/user.payload.interface';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { EntityCreateArgInput } from '../dto/args/entity.create.arg.input';
import { EntityFilterArgInput } from '../dto/args/entity.filter.arg.input';
import { EntityRemoveArgInput } from '../dto/args/entity.remove.arg.input';
import { EntityUpdateArgInput } from '../dto/args/entity.update.arg.input';
import { EntityPaginationResultInterface } from '../dto/interfaces/entity.pagination.result.interface';
import { EntitiesForSelectInterface } from '../dto/interfaces/entity.for.select.intergace';
import { EntityService } from '../services/entity.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

/**
 * The Quick Access Resolver
 */
@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EntityResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: EntityService) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => EntityEntity, {
        name: 'findEntities',
    })
    public async findEntities(
        @Args('filter')
        filter: EntityFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EntityPaginationResultInterface> {
        return this._service.findAllAndPaginate(filter, sort, pagination);
    }

    /**
     * Return all quick access with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => EntityEntity, {
        name: 'findOrganigrammes',
    })
    public async findOrganigrammes(
        @Args('filter')
        filter: EntityFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EntityPaginationResultInterface> {
        filter.hasOrganigramme = true;

        return this._service.findAllAndPaginate(filter, sort, pagination);
    }

    @Query(() => EntityEntity, {
        name: 'findEntitiesWithoutOrganigrammes',
    })
    public async findEntitiesWithoutOrganigrammes(): Promise<
        EntitiesForSelectInterface[]
    > {
        return this._service.findEntitiesWithoutOrganigrammes();
    }

    /**
     * Return all quick access with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => EntityEntity, {
        name: 'findInformations',
    })
    public async findInformations(
        @Args('filter')
        filter: EntityFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EntityPaginationResultInterface> {
        filter.hasInformation = true;

        return this._service.findAllAndPaginate(filter, sort, pagination);
    }

    @Query(() => EntityEntity, {
        name: 'findEntitiesWithoutInformations',
    })
    public async findEntitiesWithoutInformations(): Promise<
        EntitiesForSelectInterface[]
    > {
        return this._service.findEntitiesWithoutInformations();
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => EntityEntity, {
        name: 'findOneEntity',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<EntityEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EntityEntity, {
        name: 'createEntity',
    })
    public async create(
        @Args('data')
        data: EntityCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EntityEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EntityEntity, {
        name: 'updateEntity',
    })
    public async update(
        @Args('data')
        data: EntityUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EntityEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => EntityEntity, {
        name: 'removeEntity',
    })
    public async remove(
        @Args('data')
        data: EntityRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    /**
     * Remove an organigramme from Entity
     * @param id
     */
    @Mutation(() => EntityEntity, {
        name: 'removeOrganigramme',
    })
    public async removeOrganigramme(
        @Args('id')
        id?: number,
    ): Promise<boolean> {
        return this._service.removeOrganigramme(id);
    }

    /**
     * Remove an organigramme from Entity
     * @param id
     */
    @Mutation(() => EntityEntity, {
        name: 'removeInformation',
    })
    public async removeInformation(
        @Args('id')
        id?: number,
    ): Promise<boolean> {
        return this._service.removeInformation(id);
    }
}
