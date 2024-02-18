import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessEntity } from 'src/entities/psql/BusinessEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessCreateArgInput } from '../dto/args/business.create.arg.input';
import { BusinessFilterArgInput } from '../dto/args/business.filter.arg.input';
import { BusinessRemoveArgInput } from '../dto/args/business.remove.arg.input';
import { BusinessUpdateArgInput } from '../dto/args/business.update.arg.input';
import { BusinessPaginationResultInterface } from '../dto/interfaces/business.pagination.result.interface';
import { BusinessService } from '../service/business.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { BusinessToggleEditableArgInput } from '../dto/args/business.toggle.editable.arg.input';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessEntity, {
        name: 'findAllBusinesses'
    })
    public async findAllBusinesses(
        @Args('filter')
        filter: BusinessFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessPaginationResultInterface> {

        return this._service.findBusinesssAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessEntity, {
        name: 'findOneBusiness',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessEntity> {
        return this._service.findOne(id);
    }

    @Mutation(() => BusinessEntity, {
        name: 'toggleEditable',
    })
    public async toggleEditable(
        @Args('data')
        data: BusinessToggleEditableArgInput,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const result = await this._service.update({
                id: data.id,
                isEditable: data.value,
            });

            if (data.value) {

            }

            resolve(data.value);
        });
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessEntity, {
        name: 'createBusiness'
    })
    public async create(
        @Args('data')
        data: BusinessCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessEntity, {
        name: 'updateBusiness'
    })
    public async update(
        @Args('data')
        data: BusinessUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessEntity, {
        name: 'removeBusiness'
    })
    public async remove(
        @Args('data')
        data: BusinessRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
