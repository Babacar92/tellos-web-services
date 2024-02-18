import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EquipmentDocumentEntity } from 'src/entities/psql/EquipmentDocumentEntity';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { EquipmentDocumentCreateArgInput } from '../dto/args/equipment-document.create.arg.input';
import { EquipmentDocumentFilterArgInput } from '../dto/args/equipment-document.filter.arg.input';
import { EquipmentDocumentRemoveArgInput } from '../dto/args/equipment-document.remove.arg.input';
import { EquipmentDocumentUpdateArgInput } from '../dto/args/equipment-document.update.arg.input';
import { EquipmentDocumentPaginationResultInterface } from '../dto/interfaces/equipment-document.pagination.result.interface';
import { EquipmentDocumentService } from '../service/equipment-document.service';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class EquipmentDocumentResolver {

    /**
     * The constructor
     * @param _service 
     */
    public constructor(
        private readonly _service: EquipmentDocumentService,
    ) { }

    /**
     * Return all Equipment Document with pagination
     * @param filter 
     * @param user 
     * @returns 
     */
    @Query(() => EquipmentDocumentEntity, {
        name: 'findAllEquipmentDocuments'
    })
    public async findAllEquipmentDocuments(
        @Args('filter')
        filter: EquipmentDocumentFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentDocumentPaginationResultInterface> {

        return this._service.findEquipmentDocumentAndPaginationAll(filter, sort, pagination);
    }

    /**
     * Return One Equipment Document 
     * @param id 
     * @returns 
     */
    @Query(() => EquipmentDocumentEntity, {
        name: 'findOneEquipmentDocument',
    })
    public async findOne(
        @Args("id")
        id: number,
    ): Promise<EquipmentDocumentEntity> {
        return this._service.findOne(id);
    }

    /**
     * Create new Equipment Document 
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => EquipmentDocumentEntity, {
        name: 'createEquipmentDocument'
    })
    public async create(
        @Args('data')
        data: EquipmentDocumentCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentDocumentEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Equipment Document
     * @param data 
     * @param user 
     * @returns 
     */
    @Mutation(() => EquipmentDocumentEntity, {
        name: 'updateEquipmentDocument'
    })
    public async update(
        @Args('data')
        data: EquipmentDocumentUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<EquipmentDocumentEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Equipment Document
     * @param data 
     * @returns 
     */
    @Mutation(() => EquipmentDocumentEntity, {
        name: 'removeEquipmentDocument'
    })
    public async remove(
        @Args('data')
        data: EquipmentDocumentRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

}
