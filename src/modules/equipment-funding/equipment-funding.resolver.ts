import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentFundingCreateArgInput } from './dto/args/equipment-funding.create.arg.input';
import { EquipmentFundingFilterArgInput } from './dto/args/equipment-funding.filter.arg.input';
import { EquipmentFundingRemoveArgInput } from './dto/args/equipment-funding.remove.arg.input';
import { EquipmentFundingUpdateArgInput } from './dto/args/equipment-funding.update.arg.input';
import { EquipmentFundingPaginationResultInterface } from './dto/interfaces/equipment-funding.pagination.result.interface';
import { EquipmentFundingService } from './equipment-funding.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EquipmentFundingResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: EquipmentFundingService) {}

    /**
     * Return all Work Unit with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => EquipmentFunding, {
        name: 'findAllEquipmentFundings',
    })
    public async findAllEquipmentFundings(
        @Args('filter')
        filter: EquipmentFundingFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentFundingPaginationResultInterface> {
        return this._service.findEquipmentFundingsAndPaginationAll(
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
    @Query(() => EquipmentFunding, {
        name: 'findOneEquipmentFunding',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<EquipmentFunding> {
        return this._service.findOne(id);
    }

    /**
     * Create new Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EquipmentFunding, {
        name: 'createEquipmentFunding',
    })
    public async create(
        @Args('data')
        data: EquipmentFundingCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentFunding> {
        return this._service.create(data);
    }

    /**
     * Update an existing Work Unit
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EquipmentFunding, {
        name: 'updateEquipmentFunding',
    })
    public async update(
        @Args('data')
        data: EquipmentFundingUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentFunding> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Work Unit
     * @param data
     * @returns
     */
    @Mutation(() => EquipmentFunding, {
        name: 'removeEquipmentFunding',
    })
    public async remove(
        @Args('data')
        data: EquipmentFundingRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
