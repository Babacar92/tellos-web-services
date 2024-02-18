import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { MedicalVisitCreateArgInput } from '../dto/args/medical-visit.create.arg.input';
import { MedicalVisitFilterArgInput } from '../dto/args/medical-visit.filter.arg.input';
import { MedicalVisitRemoveArgInput } from '../dto/args/medical-visit.remove.arg.input';
import { MedicalVisitUpdateArgInput } from '../dto/args/medical-visit.update.arg.input';
import { MedicalVisitPaginationResultInterface } from '../dto/interfaces/medical-visit.pagination.result.interface';
import { MedicalVisitService } from '../service/medical-visit.service';
import { MedicalVisitEntity } from 'src/entities/psql/MedicalVisitEntity';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class MedicalVisitResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: MedicalVisitService,
    ) { }

    /**
     * Return all Medical Visit with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() =>  MedicalVisitEntity, {
        name: 'findAllMedicalVisits'
    })
    public async findAllCareerPath(
        @Args('filter')
        filter: MedicalVisitFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<MedicalVisitPaginationResultInterface> {
        return this._service.findMedicalVisitAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Medical Visit
     * @param id 
     * @returns 
     */
    @Query(() =>  MedicalVisitEntity, {
        name: 'findOneMedicalVisit',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise< MedicalVisitEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Medical Visit
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() =>  MedicalVisitEntity, {
        name: 'createMedicalVisit'
    })
    public async create(
        @Args('data')
        data: MedicalVisitCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise< MedicalVisitEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Medical Visit
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() =>  MedicalVisitEntity, {
        name: 'updateMedicalVisit'
    })
    public async update(
        @Args('data')
        data: MedicalVisitUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise< MedicalVisitEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Medical Visit
     * @param data 
     * @returns 
     */
    @Mutation(() =>  MedicalVisitEntity, {
        name: 'removeMedicalVisit'
    })
    public async remove(
        @Args('data')
        data: MedicalVisitRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
