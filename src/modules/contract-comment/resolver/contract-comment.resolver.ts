import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContractCommentEntity } from 'src/entities/psql/ContractCommentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ContractCommentCreateArgInput } from '../dto/args/contract-comment.create.arg.input';
import { ContractCommentFilterArgInput } from '../dto/args/contract-comment.filter.arg.input';
import { ContractCommentRemoveArgInput } from '../dto/args/contract-comment.remove.arg.input';
import { ContractCommentUpdateArgInput } from '../dto/args/contract-comment.update.arg.input';
import { ContractCommentPaginationResultInterface } from '../dto/interfaces/contract-comment.pagination.result.interface';
import { ContractCommentService } from '../service/contract-comment.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { EmployeeService } from '../../employee/service/employee.service';

@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class ContractCommentResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: ContractCommentService,
        private readonly _employeeService: EmployeeService,
    ) {}

    /**
     * Return all Comment Contract with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => ContractCommentEntity, {
        name: 'findAllContractComments',
    })
    public async findAllContractComments(
        @Args('filter')
        filter: ContractCommentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractCommentPaginationResultInterface> {
        return this._service.findContractCommentAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Comment Contract
     * @param id
     * @returns
     */
    @Query(() => ContractCommentEntity, {
        name: 'findOneContractComment',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<ContractCommentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Comment Contract
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ContractCommentEntity, {
        name: 'createContractComment',
    })
    public async create(
        @Args('data')
        data: ContractCommentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractCommentEntity> {
        data.employee = await this._employeeService.findByColumn(
            'login',
            user.sub,
        );
        return this._service.create(data);
    }

    /**
     * Update an existing Comment Contract
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ContractCommentEntity, {
        name: 'updateContractComment',
    })
    public async update(
        @Args('data')
        data: ContractCommentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ContractCommentEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Comment Contract
     * @param data
     * @returns
     */
    @Mutation(() => ContractCommentEntity, {
        name: 'removeContractComment',
    })
    public async remove(
        @Args('data')
        data: ContractCommentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
