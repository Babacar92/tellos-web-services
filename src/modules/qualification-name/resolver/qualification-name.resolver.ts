import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QualificationNameEntity } from 'src/entities/psql/QualificationNameEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { QualificationNameCreateArgInput } from '../dto/args/qualification-name.create.arg.input';
import { QualificationNameFilterArgInput } from '../dto/args/qualification-name.filter.arg.input';
import { QualificationNameRemoveArgInput } from '../dto/args/qualification-name.remove.arg.input';
import { QualificationNameUpdateArgInput } from '../dto/args/qualification-name.update.arg.input';
import { QualificationNamePaginationResultInterface } from '../dto/interfaces/qualification-name.pagination.result.interface';
import { QualificationNameService } from '../service/qualification-name.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class QualificationNameResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: QualificationNameService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => QualificationNameEntity, {
        name: 'findAllQualificationsNames'
    })
    public async findAllQualificationsNames(
        @Args('filter')
        filter: QualificationNameFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QualificationNamePaginationResultInterface> {

        return this._service.findQualificationNamesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => QualificationNameEntity, {
        name: 'findOneQualificationName',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<QualificationNameEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => QualificationNameEntity, {
        name: 'createQualificationName'
    })
    public async create(
        @Args('data')
        data: QualificationNameCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QualificationNameEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => QualificationNameEntity, {
        name: 'updateQualificationName'
    })
    public async update(
        @Args('data')
        data: QualificationNameUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<QualificationNameEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => QualificationNameEntity, {
        name: 'removeQualificationName'
    })
    public async remove(
        @Args('data')
        data: QualificationNameRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
