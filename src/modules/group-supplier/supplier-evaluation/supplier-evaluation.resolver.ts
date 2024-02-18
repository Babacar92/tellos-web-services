// NestJS
import { UseGuards } from '@nestjs/common';
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';

// Dataloader
import Dataloader from 'dataloader';

// Schemas
import { LoginEntity } from '@Entities/LoginEntity';
import { SupplierEvaluation } from '@Entities/supplier-evaluation.entity';

// Libs
import { PaginationArg } from '@Libs/databases/dto/args/pagination.arg';
import { CurrentUser } from '@Libs/auth/decorators/user.resolver.decorators';
import { DatabaseSortArg } from '@Libs/databases/dto/args/database.sort.arg';
import { UserPayloadInterface } from '@Libs/auth/dto/interfaces/user.payload.interface';

// DTOs
// ---- Inputs
import { SupplierEvaluationCreateInput } from './dto/inputs/supplier-evaluation.create.input';
import { SupplierEvaluationRemoveInput } from './dto/inputs/supplier-evaluation.remove.input';
import { SupplierEvaluationUpdateInput } from './dto/inputs/supplier-evaluation.update.input';
// ---- Args
import { SupplierEvaluationFilterArgs } from './dto/args/supplier-evaluation.filter.args';
// ---- Responses
import { SupplierEvaluationsResponse } from './dto/responses/supplier-evaluations.response';

// Services
import { SupplierEvaluationService } from './supplier-evaluation.service';

// Guard
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { Supplier } from '@/entities/psql/supplier.entity';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => SupplierEvaluation)
export class SupplierEvaluationResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(private readonly _service: SupplierEvaluationService) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => SupplierEvaluationsResponse, {
        name: 'findAllSupplierEvaluations',
    })
    public async findAllSupplierEvaluations(
        @Args('filter') filter: SupplierEvaluationFilterArgs,
        @Args('sort') sort: DatabaseSortArg,
        @Args('pagination') pagination: PaginationArg,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierEvaluationsResponse> {
        return this._service.findAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => SupplierEvaluation, { name: 'findOneSupplierEvaluation' })
    public async findOne(@Args('id') id: number): Promise<SupplierEvaluation> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => SupplierEvaluation, { name: 'createSupplierEvaluation' })
    public async create(
        @Args('data') data: SupplierEvaluationCreateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierEvaluation> {
        data.login = LoginEntity.init(user.sub);
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => SupplierEvaluation, { name: 'updateSupplierEvaluation' })
    public async update(
        @Args('data') data: SupplierEvaluationUpdateInput,
        @CurrentUser() user: UserPayloadInterface,
    ): Promise<SupplierEvaluation> {
        data.login = LoginEntity.init(user.sub);
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => SupplierEvaluation, {
        name: 'removeSupplierEvaluation',
    })
    public async remove(
        @Args('data') data: SupplierEvaluationRemoveInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    @ResolveField('login', (returns) => LoginEntity)
    public async login(
        @Parent() parent: SupplierEvaluation,
        @Context('loginLoader') loginLoader: Dataloader<number, LoginEntity>,
    ): Promise<LoginEntity> {
        return parent.login_id ? loginLoader.load(parent.login_id) : null;
    }

    @ResolveField('supplier', (returns) => Supplier)
    public async supplier(
        @Parent() parent: SupplierEvaluation,
        @Context('supplierLoader') supplierLoader: Dataloader<number, Supplier>,
    ): Promise<Supplier> {
        return parent.supplierId
            ? supplierLoader.load(parent.supplierId)
            : null;
    }
}
