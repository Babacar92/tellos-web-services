import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessDocumentClassificationEntity } from 'src/entities/psql/BusinessDocumentClassificationEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { BusinessDocumentClassificationCreateArgInput } from '../dto/args/business-document-classification.create.arg.input';
import { BusinessDocumentClassificationFilterArgInput } from '../dto/args/business-document-classification.filter.arg.input';
import { BusinessDocumentClassificationRemoveArgInput } from '../dto/args/business-document-classification.remove.arg.input';
import { BusinessDocumentClassificationUpdateArgInput } from '../dto/args/business-document-classification.update.arg.input';
import { BusinessDocumentClassificationPaginationResultInterface } from '../dto/interfaces/business-document-classification.pagination.result.interface';
import { BusinessDocumentClassificationService } from '../service/business-document-classification.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class BusinessDocumentClassificationResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: BusinessDocumentClassificationService,
    ) { }

    /**
     * Return all quick access with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => BusinessDocumentClassificationEntity, {
        name: 'findAllBusinessDocumentClassifications'
    })
    public async findAllBusinessDocumentClassifications(
        @Args('filter')
        filter: BusinessDocumentClassificationFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentClassificationPaginationResultInterface> {

        return this._service.findBusinessDocumentClassificationsAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Quick Access
     * @param id 
     * @returns 
     */
    @Query(() => BusinessDocumentClassificationEntity, {
        name: 'findOneBusinessDocumentClassification',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<BusinessDocumentClassificationEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessDocumentClassificationEntity, {
        name: 'createBusinessDocumentClassification'
    })
    public async create(
        @Args('data')
        data: BusinessDocumentClassificationCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentClassificationEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => BusinessDocumentClassificationEntity, {
        name: 'updateBusinessDocumentClassification'
    })
    public async update(
        @Args('data')
        data: BusinessDocumentClassificationUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<BusinessDocumentClassificationEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data 
     * @returns 
     */
    @Mutation(() => BusinessDocumentClassificationEntity, {
        name: 'removeBusinessDocumentClassification'
    })
    public async remove(
        @Args('data')
        data: BusinessDocumentClassificationRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
