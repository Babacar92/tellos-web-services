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
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { CategoryEquipmentCreateArgInput } from '../dto/args/category-equipment.create.arg.input';
import { CategoryEquipmentFilterArgInput } from '../dto/args/category-equipment.filter.arg.input';
import { CategoryEquipmentRemoveArgInput } from '../dto/args/category-equipment.remove.arg.input';
import { CategoryEquipmentUpdateArgInput } from '../dto/args/category-equipment.update.arg.input';
import { CategoryEquipmentPaginationResultInterface } from '../dto/interfaces/category-equipment.pagination.result.interface';
import { CategoryEquipmentService } from '../service/category-equipment.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { CategoryEquipmentFilterEquipmentRateArgInput } from '../dto/args/category-equipment.filter.for.equipment.rate.arg.input';
import { MediumSizedCentreEntity } from '@/entities/psql/MediumSizedCentreEntity';

//Librairies
import Dataloader from 'dataloader';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => CategoryEquipment)
export class CategoryEquipmentResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: CategoryEquipmentService) {}

    /**
     * Return all CategoryEquipment with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => CategoryEquipment, {
        name: 'findAllCategoryEquipments',
    })
    public async findAllCategoryEquipments(
        @Args('filter')
        filter: CategoryEquipmentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CategoryEquipmentPaginationResultInterface> {
        //
        return this._service.findCategoryEquipmentAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return all Section Code with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => CategoryEquipment, {
        name: 'findAllCategoryEquipmentsForEquipmentRate',
    })
    public async findAllCategoryEquipmentsForEquipmentRate(
        @Args('filter')
        filter: CategoryEquipmentFilterEquipmentRateArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CategoryEquipmentPaginationResultInterface> {
        return this._service.findAllCategoryEquipmentsForEquipmentRate(
            filter,
            sort,
            pagination,
        );
    }

    @ResolveField('mediumSizedCentre', (returns) => MediumSizedCentreEntity)
    async mediumSizedCentre(
        @Parent() parent: CategoryEquipment,
        @Context('mediumSizedCenterLoader')
        mediumSizedCenterLoader: Dataloader<number, MediumSizedCentreEntity>,
    ): Promise<MediumSizedCentreEntity> {
        return parent.medium_sized_centre_id
            ? mediumSizedCenterLoader.load(parent.medium_sized_centre_id)
            : null;
    }

    /**
     * Return One CategoryEquipment
     * @param id
     * @returns
     */
    @Query(() => CategoryEquipment, {
        name: 'findOneCategoryEquipment',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<CategoryEquipment> {
        return this._service.findOne(id);
    }

    /**
     * Create new CategoryEquipment
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => CategoryEquipment, {
        name: 'createCategoryEquipment',
    })
    public async create(
        @Args('data')
        data: CategoryEquipmentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CategoryEquipment> {
        return this._service.create(data);
    }

    /**
     * Update an existing CategoryEquipment
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => CategoryEquipment, {
        name: 'updateCategoryEquipment',
    })
    public async update(
        @Args('data')
        data: CategoryEquipmentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<CategoryEquipment> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing CategoryEquipment
     * @param data
     * @returns
     */
    @Mutation(() => CategoryEquipment, {
        name: 'removeCategoryEquipment',
    })
    public async remove(
        @Args('data')
        data: CategoryEquipmentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
