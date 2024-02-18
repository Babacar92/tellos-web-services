import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ContractApprenticeCreateArgInput } from '../dto/args/contract-apprentice.create.arg.input';
import { ContractApprenticeFilterArgInput } from '../dto/args/contract-apprentice.filter.arg.input';
import { ContractApprenticeRemoveArgInput } from '../dto/args/contract-apprentice.remove.arg.input';
import { ContractApprenticeUpdateArgInput } from '../dto/args/contract-apprentice.update.arg.input';
import { ContractApprenticePaginationResultInterface } from '../dto/interfaces/contract-apprentice.pagination.result.interface';
import { ContractApprenticeService } from '../service/contract-apprentice.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { ContractApprenticeEntity } from 'src/entities/psql/ContractApprenticeEntity';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class ContractApprenticeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: ContractApprenticeService,
    ) { }

    /**
     * Return all Employe Contract Apprentice with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => ContractApprenticeEntity, {
        name: 'findAllContractApprentices'
    })
    public async findAllContractApprentice(
        @Args('filter')
        filter: ContractApprenticeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractApprenticePaginationResultInterface> {

        return this._service.findEmployeContractApprenticeAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Employe Contract Apprentice
     * @param id 
     * @returns 
     */
    @Query(() => ContractApprenticeEntity, {
        name: 'findOneContractApprentice',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<ContractApprenticeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Employe Contract Apprentice
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractApprenticeEntity, {
        name: 'createContractApprentice'
    })
    public async create(
        @Args('data')
        data: ContractApprenticeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractApprenticeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Employe Contract Apprentice
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractApprenticeEntity, {
        name: 'updateContractApprentice'
    })
    public async update(
        @Args('data')
        data: ContractApprenticeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractApprenticeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Employe Contract Apprentice
     * @param data 
     * @returns 
     */
    @Mutation(() => ContractApprenticeEntity, {
        name: 'removeContractApprentice'
    })
    public async remove(
        @Args('data')
        data: ContractApprenticeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
