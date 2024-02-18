import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { CurrentUser } from '../../../libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from '../../../libs/auth/dto/interfaces/user.payload.interface';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { ParagraphFrameCreateArgInput } from '../dto/args/paragraph-frame.create.arg.input';
import { ParagraphFrameFilterArgInput } from '../dto/args/paragraph-frame.filter.arg.input';
import { ParagraphFrameRemoveArgInput } from '../dto/args/paragraph-frame.remove.arg.input';
import { ParagraphFrameUpdateArgInput } from '../dto/args/paragraph-frame.update.arg.input';
import { ParagraphFramePaginationResultInterface } from '../dto/interfaces/paragraph-frame.pagination.result.interface';
import { ParagraphFrameService } from '../services/paragraph-frame.service';
import { ParagraphFrameEntity } from 'src/entities/psql/ParagraphFrameEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { EmployeeService } from '../../employee/service/employee.service';

/**
 * The Quick Access Resolver
 */
@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class ParagraphFrameResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: ParagraphFrameService,
        private readonly _employeeService: EmployeeService,
    ) {}

    /**
     * Return all quick access with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => ParagraphFrameEntity, {
        name: 'findAllParagraphsFrames',
    })
    public async findAllParagraphsFrames(
        @Args('filter')
        filter: ParagraphFrameFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ParagraphFramePaginationResultInterface> {
        filter.employee = await this._employeeService.findByColumn(
            'login',
            user.sub,
        );

        return this._service.findParagraphFrameAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => ParagraphFrameEntity, {
        name: 'findOneParagraphFrame',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<ParagraphFrameEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ParagraphFrameEntity, {
        name: 'createParagraphFrame',
    })
    public async create(
        @Args('data')
        data: ParagraphFrameCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ParagraphFrameEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ParagraphFrameEntity, {
        name: 'updateParagraphFrame',
    })
    public async update(
        @Args('data')
        data: ParagraphFrameUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ParagraphFrameEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => ParagraphFrameEntity, {
        name: 'removeParagraphFrame',
    })
    public async remove(
        @Args('data')
        data: ParagraphFrameRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
