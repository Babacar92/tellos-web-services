import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContractLevelEntity } from 'src/entities/psql/ContractLevelEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ContractLevelCreateArgInput } from '../dto/args/contract-level.create.arg.input';
import { ContractLevelFilterArgInput } from '../dto/args/contract-level.filter.arg.input';
import { ContractLevelRemoveArgInput } from '../dto/args/contract-level.remove.arg.input';
import { ContractLevelUpdateArgInput } from '../dto/args/contract-level.update.arg.input';
import { ContractLevelPaginationResultInterface } from '../dto/interfaces/contract-level.pagination.result.interface';
import { ContractLevelService } from '../service/contract-level.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class ContractLevelResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: ContractLevelService,
    ) { }

    /**
     * Return all Employe Contract Level with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => ContractLevelEntity, {
        name: 'findAllContractLevels'
    })
    public async findAllContractLevel(
        @Args('filter')
        filter: ContractLevelFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractLevelPaginationResultInterface> {

        return this._service.findEmployeContractLevelAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One find Employe Contract Level
     * @param id 
     * @returns 
     */
    @Query(() => ContractLevelEntity, {
        name: 'findOneContractLevel',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<ContractLevelEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Employe Contract Level
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractLevelEntity, {
        name: 'createContractLevel'
    })
    public async create(
        @Args('data')
        data: ContractLevelCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractLevelEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Employe Contract Level
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractLevelEntity, {
        name: 'updateContractLevel'
    })
    public async update(
        @Args('data')
        data: ContractLevelUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractLevelEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Employe Contract Level
     * @param data 
     * @returns 
     */
    @Mutation(() => ContractLevelEntity, {
        name: 'removeContractLevel'
    })
    public async remove(
        @Args('data')
        data: ContractLevelRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
