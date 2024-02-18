import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContractTypeEntryEntity } from 'src/entities/psql/ContractTypeEntryEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ContractTypeEntryCreateArgInput } from '../dto/args/contract-type-entry.create.arg.input';
import { ContractTypeEntryFilterArgInput } from '../dto/args/contract-type-entry.filter.arg.input';
import { ContractTypeEntryRemoveArgInput } from '../dto/args/contract-type-entry.remove.arg.input';
import { ContractTypeEntryUpdateArgInput } from '../dto/args/contract-type-entry.update.arg.input';
import { ContractTypeEntryPaginationResultInterface } from '../dto/interfaces/contract-type-entry.pagination.result.interface';
import { ContractTypeEntryService } from '../service/contract-type-entry.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class ContractTypeEntryResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: ContractTypeEntryService,
    ) { }

    /**
     * Return all Employe Contract Type Entry with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => ContractTypeEntryEntity, {
        name: 'findAllContractTypeEntries'
    })
    public async findAllContractTypeEntries(
        @Args('filter')
        filter: ContractTypeEntryFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractTypeEntryPaginationResultInterface> {

        return this._service.findEmployeContractTypeEntryAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Employe Contract Type Entry
     * @param id 
     * @returns 
     */
    @Query(() => ContractTypeEntryEntity, {
        name: 'findOneContractTypeEntry',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<ContractTypeEntryEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Employe Contract Type Entry
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractTypeEntryEntity, {
        name: 'createContractTypeEntry'
    })
    public async create(
        @Args('data')
        data: ContractTypeEntryCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractTypeEntryEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Employe Contract Type Entry
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractTypeEntryEntity, {
        name: 'updateContractTypeEntry'
    })
    public async update(
        @Args('data')
        data: ContractTypeEntryUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractTypeEntryEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Employe Contract Type Entry
     * @param data 
     * @returns 
     */
    @Mutation(() => ContractTypeEntryEntity, {
        name: 'removeContractTypeEntry'
    })
    public async remove(
        @Args('data')
        data: ContractTypeEntryRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
