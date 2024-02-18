import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentCreateArgInput } from '../dto/args/equipment.create.arg.input';
import { EquipmentFilterArgInput } from '../dto/args/equipment.filter.arg.input';
import { EquipmentRemoveArgInput } from '../dto/args/equipment.remove.arg.input';
import { EquipmentUpdateArgInput } from '../dto/args/equipment.update.arg.input';
import { EquipmentPaginationResultInterface } from '../dto/interfaces/equipment.pagination.result.interface';
import { EquipmentService } from '../service/equipment.service';
import { EquipmentEntity } from 'src/entities/psql/EquipmentEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class EquipmentResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: EquipmentService) {}

    /**
     * Return all Equipment with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => EquipmentEntity, {
        name: 'findAllEquipments',
    })
    public async findAllEquipments(
        @Args('filter')
        filter: EquipmentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentPaginationResultInterface> {
        return this._service.findEquipmentAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Equipment
     * @param id
     * @returns
     */
    @Query(() => EquipmentEntity, {
        name: 'findOneEquipment',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<EquipmentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Equipment
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EquipmentEntity, {
        name: 'createEquipment',
    })
    public async create(
        @Args('data')
        data: EquipmentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Equipment
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => EquipmentEntity, {
        name: 'updateEquipment',
    })
    public async update(
        @Args('data')
        data: EquipmentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Equipment
     * @param data
     * @returns
     */
    @Mutation(() => EquipmentEntity, {
        name: 'removeEquipment',
    })
    public async remove(
        @Args('data')
        data: EquipmentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
