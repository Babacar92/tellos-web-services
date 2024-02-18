import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ContractSectionCreateArgInput } from '../dto/args/contract-section.create.arg.input';
import { ContractSectionFilterArgInput } from '../dto/args/contract-section.filter.arg.input';
import { ContractSectionRemoveArgInput } from '../dto/args/contract-section.remove.arg.input';
import { ContractSectionUpdateArgInput } from '../dto/args/contract-section.update.arg.input';
import { ContractSectionPaginationResultInterface } from '../dto/interfaces/contract-section.pagination.result.interface';
import { ContractSectionService } from '../service/contract-section.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { ContractSectionEntity } from 'src/entities/psql/ContractSectionEntity';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class ContractSectionResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: ContractSectionService,
    ) { }

    /**
     * Return all Employe Contract Section with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => ContractSectionEntity, {
        name: 'findAllContractSections'
    })
    public async findAllContractSections(
        @Args('filter')
        filter: ContractSectionFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractSectionPaginationResultInterface> {

        return this._service.findEmployeContractSectionAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Employe Contract Section 
     * @param id 
     * @returns 
     */
    @Query(() => ContractSectionEntity, {
        name: 'findOneContractSection',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<ContractSectionEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Employe Contract Section 
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractSectionEntity, {
        name: 'createContractSection'
    })
    public async create(
        @Args('data')
        data: ContractSectionCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractSectionEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Employe Contract Section 
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractSectionEntity, {
        name: 'updateContractSection'
    })
    public async update(
        @Args('data')
        data: ContractSectionUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractSectionEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Employe Contract Section 
     * @param data 
     * @returns 
     */
    @Mutation(() => ContractSectionEntity, {
        name: 'removeContractSection'
    })
    public async remove(
        @Args('data')
        data: ContractSectionRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
