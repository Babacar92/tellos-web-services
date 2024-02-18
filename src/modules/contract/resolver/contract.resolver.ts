import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContractEntity } from 'src/entities/psql/ContractEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ContractCreateArgInput } from '../dto/args/contract.create.arg.input';
import { ContractFilterArgInput } from '../dto/args/contract.filter.arg.input';
import { ContractRemoveArgInput } from '../dto/args/contract.remove.arg.input';
import { ContractUpdateArgInput } from '../dto/args/contract.update.arg.input';
import { ContractPaginationResultInterface } from '../dto/interfaces/contract.pagination.result.interface';
import { ContractService } from '../service/contract.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { dump } from '../../../utils/utils';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class ContractResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: ContractService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => ContractEntity, {
        name: 'findAllContracts'
    })
    public async findAllContracts(
        @Args('filter')
        filter: ContractFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractPaginationResultInterface> {

        return this._service.findContractAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => ContractEntity, {
        name: 'findOneContract',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<ContractEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractEntity, {
        name: 'createContract'
    })
    public async create(
        @Args('data')
        data: ContractCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractEntity, {
        name: 'updateContract'
    })
    public async update(
        @Args('data')
        data: ContractUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => ContractEntity, {
        name: 'removeContract'
    })
    public async remove(
        @Args('data')
        data: ContractRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
