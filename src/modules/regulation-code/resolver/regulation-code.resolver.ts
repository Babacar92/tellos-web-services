import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegulationCodeEntity } from 'src/entities/psql/RegulationCodeEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { RegulationCodeCreateArgInput } from '../dto/args/regulation-code.create.arg.input';
import { RegulationCodeFilterArgInput } from '../dto/args/regulation-code.filter.arg.input';
import { RegulationCodeRemoveArgInput } from '../dto/args/regulation-code.remove.arg.input';
import { RegulationCodeUpdateArgInput } from '../dto/args/regulation-code.update.arg.input';
import { RegulationCodePaginationResultInterface } from '../dto/interfaces/regulation-code.pagination.result.interface';
import { RegulationCodeService } from '../service/regulation-code.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class RegulationCodeResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: RegulationCodeService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => RegulationCodeEntity, {
        name: 'findAllRegulationCodes'
    })
    public async findAllRegulationCodes(
        @Args('filter')
        filter: RegulationCodeFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<RegulationCodePaginationResultInterface> {

        return this._service.findRegulationCodesAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => RegulationCodeEntity, {
        name: 'findOneRegulationCode',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<RegulationCodeEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => RegulationCodeEntity, {
        name: 'createRegulationCode'
    })
    public async create(
        @Args('data')
        data: RegulationCodeCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<RegulationCodeEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => RegulationCodeEntity, {
        name: 'updateRegulationCode'
    })
    public async update(
        @Args('data')
        data: RegulationCodeUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<RegulationCodeEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => RegulationCodeEntity, {
        name: 'removeRegulationCode'
    })
    public async remove(
        @Args('data')
        data: RegulationCodeRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
