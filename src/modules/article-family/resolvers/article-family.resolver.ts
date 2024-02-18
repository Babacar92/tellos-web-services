import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { ArticleFamilyEntity } from '../../../entities/psql/ArticleFamilyEntity';
import { CurrentUser } from '../../../libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from '../../../libs/auth/dto/interfaces/user.payload.interface';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { ArticleFamilyCreateArgInput } from '../dto/args/article-family.create.arg.input';
import { ArticleFamilyFilterArgInput } from '../dto/args/article-family.filter.arg.input';
import { ArticleFamilyRemoveArgInput } from '../dto/args/article-family.remove.arg.input';
import { ArticleFamilyUpdateArgInput } from '../dto/args/article-family.update.arg.input';
import { ArticleFamilyPaginationResultInterface } from '../dto/interfaces/article-family.pagination.result.interface';
import { ArticleFamilyService } from '../services/article-family.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';
import { EmployeeService } from '../../employee/service/employee.service';

/**
 * The Article Family Resolver
 */
@UseGuards(LoginUserPermissionGuard)
@Resolver()
export class ArticleFamilyResolver {
    /**
     * The constructor
     * @param _service
     */
    public constructor(
        private readonly _service: ArticleFamilyService,
        private readonly _employeeService: EmployeeService,
    ) {}

    /**
     * Return all article family with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => ArticleFamilyEntity, {
        name: 'findAllArticleFamily',
    })
    public async findAllArticleFamily(
        @Args('filter')
        filter: ArticleFamilyFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ArticleFamilyPaginationResultInterface> {
        return this._service.findArticleFamilyAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return all article family available to be a child family with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => ArticleFamilyEntity, {
        name: 'findAllArticleFamilyAvailableForChild',
    })
    public async findAllArticleFamilyAvailableForChild(
        @Args('filter')
        filter: ArticleFamilyFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ArticleFamilyPaginationResultInterface> {
        filter.availableForChild = true;
        return this._service.findArticleFamilyAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return all article family available to be a parent family with pagination
     * @param filter
     * @param user
     * @returns
     */
    @Query(() => ArticleFamilyEntity, {
        name: 'findAllArticleFamilyAvailableForParent',
    })
    public async findAllArticleFamilyAvailableForParent(
        @Args('filter')
        filter: ArticleFamilyFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ArticleFamilyPaginationResultInterface> {
        filter.availableForParent = true;
        return this._service.findArticleFamilyAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Article Family
     * @param id
     * @returns
     */
    @Query(() => ArticleFamilyEntity, {
        name: 'findOneArticleFamily',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<ArticleFamilyEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Article Family
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ArticleFamilyEntity, {
        name: 'createArticleFamily',
    })
    public async create(
        @Args('data')
        data: ArticleFamilyCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ArticleFamilyEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Article Family
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => ArticleFamilyEntity, {
        name: 'updateArticleFamily',
    })
    public async update(
        @Args('data')
        data: ArticleFamilyUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<ArticleFamilyEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Article Family
     * @param data
     * @returns
     */
    @Mutation(() => ArticleFamilyEntity, {
        name: 'removeArticleFamily',
    })
    public async remove(
        @Args('data')
        data: ArticleFamilyRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }
}
