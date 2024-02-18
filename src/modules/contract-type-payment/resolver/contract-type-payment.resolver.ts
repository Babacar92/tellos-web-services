import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContractTypePaymentEntity } from 'src/entities/psql/ContractTypePaymentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ContractTypePaymentCreateArgInput } from '../dto/args/contract-type-payment.create.arg.input';
import { ContractTypePaymentFilterArgInput } from '../dto/args/contract-type-payment.filter.arg.input';
import { ContractTypePaymentRemoveArgInput } from '../dto/args/contract-type-payment.remove.arg.input';
import { ContractTypePaymentUpdateArgInput } from '../dto/args/contract-type-payment.update.arg.input';
import { ContractTypePaymentPaginationResultInterface } from '../dto/interfaces/contract-type-payment.pagination.result.interface';
import { ContractTypePaymentService } from '../service/contract-type-payment.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class ContractTypePaymentResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: ContractTypePaymentService,
    ) { }

    /**
     * Return all Employe Contract Type Payment with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => ContractTypePaymentEntity, {
        name: 'findAllContractTypePayments'
    })
    public async findAllContractTypePayment(
        @Args('filter')
        filter: ContractTypePaymentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractTypePaymentPaginationResultInterface> {

        return this._service.findEmployeContractTypePaymentAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Employe Contract Type Payment
     * @param id 
     * @returns 
     */
    @Query(() => ContractTypePaymentEntity, {
        name: 'findOneContractTypePayment',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<ContractTypePaymentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Employe Contract Type Payment
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractTypePaymentEntity, {
        name: 'createContractTypePayment'
    })
    public async create(
        @Args('data')
        data: ContractTypePaymentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractTypePaymentEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Employe Contract Type Payment
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => ContractTypePaymentEntity, {
        name: 'updateContractTypePayment'
    })
    public async update(
        @Args('data')
        data: ContractTypePaymentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractTypePaymentEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Employe Contract Type Payment
     * @param data 
     * @returns 
     */
    @Mutation(() => ContractTypePaymentEntity, {
        name: 'removeContractTypePayment'
    })
    public async remove(
        @Args('data')
        data: ContractTypePaymentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
