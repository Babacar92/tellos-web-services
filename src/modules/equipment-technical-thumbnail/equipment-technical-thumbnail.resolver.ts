import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EquipmentTechnicalThumbnail } from 'src/entities/psql/equipment-technical-thumbnail.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentTechnicalThumbnailCreateArgInput } from './dto/args/equipment-technical-thumbnail.create.arg.input';
import { EquipmentTechnicalThumbnailFilterArgInput } from './dto/args/equipment-technical-thumbnail.filter.arg.input';
import { EquipmentTechnicalThumbnailRemoveArgInput } from './dto/args/equipment-technical-thumbnail.remove.arg.input';
import { EquipmentTechnicalThumbnailUpdateArgInput } from './dto/args/equipment-technical-thumbnail.update.arg.input';
import { EquipmentTechnicalThumbnailPaginationResultInterface } from './dto/interfaces/equipment-technical-thumbnail.pagination.result.interface';
import { EquipmentTechnicalThumbnailService } from './equipment-technical-thumbnail.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EquipmentTechnicalThumbnailResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: EquipmentTechnicalThumbnailService,
    ) {}

    /**
     * Return all Work Unit with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => EquipmentTechnicalThumbnail, {
        name: 'findAllEquipmentTechnicalThumbnails',
    })
    public async findAllEquipmentTechnicalThumbnails(
        @Args('filter')
        filter: EquipmentTechnicalThumbnailFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentTechnicalThumbnailPaginationResultInterface> {
        return this._service.findEquipmentTechnicalThumbnailsAndPaginationAll(
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
    @Query(() => EquipmentTechnicalThumbnail, {
        name: 'findOneEquipmentTechnicalThumbnail',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<EquipmentTechnicalThumbnail> {
        return this._service.findOne(id);
    }

    /**
     * Create new Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EquipmentTechnicalThumbnail, {
        name: 'createEquipmentTechnicalThumbnail',
    })
    public async create(
        @Args('data')
        data: EquipmentTechnicalThumbnailCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentTechnicalThumbnail> {
        return this._service.create(data);
    }

    /**
     * Update an existing Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EquipmentTechnicalThumbnail, {
        name: 'updateEquipmentTechnicalThumbnail',
    })
    public async update(
        @Args('data')
        data: EquipmentTechnicalThumbnailUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentTechnicalThumbnail> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Work Unit
     * @param data
     * @returns
     */
    @Mutation(() => EquipmentTechnicalThumbnail, {
        name: 'removeEquipmentTechnicalThumbnail',
    })
    public async remove(
        @Args('data')
        data: EquipmentTechnicalThumbnailRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
