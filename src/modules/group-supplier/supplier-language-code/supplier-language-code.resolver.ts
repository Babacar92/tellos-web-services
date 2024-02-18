// NestJs
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

//Guards
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

//Entity
import { SupplierLanguageCodeEntity } from '@Entities/SupplierLanguageCodeEntity';

//Services
import { SupplierLanguageCodeService } from './supplier-language-code.service';

//Responses

//Args
import { SupplierLanguageCodeFilterArgs } from './dto/args/supplier-language-code.filter.args';
import { DatabaseSortArg } from '@/libs/databases/dto/args/database.sort.arg';

//Inputs
import { SupplierLanguageCodeCreateInput } from './dto/inputs/supplier-language-code.create.input';
import { SupplierLanguageCodeUpdateInput } from './dto/inputs/supplier-language-code.update.input';
import { PaginationArg } from '@/libs/databases/dto/args/pagination.arg';
import { SupplierLanguageCodesResponse } from './responses/supplier-language-codes.response';
import { SupplierLanguageCodeRemoveInput } from './dto/inputs/supplier-language-code.remove.input';

//Errors
// import handleError from '@Errors/handleError';

@UseGuards(LoginUserPermissionGuard)
@Resolver(() => SupplierLanguageCodeEntity)
export class SupplierLanguageCodeResolver {
    public constructor(
        private readonly _service: SupplierLanguageCodeService,
    ) {}

    //Find List of SupplierLanguageCodes
    @Query(() => [SupplierLanguageCodesResponse], {
        name: 'findAllSupplierLanguageCodes',
    })
    public async findAllSupplierLanguageCodes(
        @Args('filter')
        filter: SupplierLanguageCodeFilterArgs,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
    ): Promise<SupplierLanguageCodesResponse | Error> {
        return this._service.findSupplierLanguageCodesAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    //Find One SupplierLanguageCode
    @Query(() => SupplierLanguageCodeEntity, {
        name: 'findOneSupplierLanguageCode',
    })
    public async findOneSupplierLanguageCode(
        @Args('id')
        id: number,
    ): Promise<SupplierLanguageCodeEntity | Error> {
        return await this._service.findOne(id);
    }

    //Create New SupplierLanguageCode
    @Mutation(() => SupplierLanguageCodeEntity, {
        name: 'createSupplierLanguageCode',
    })
    public async createSupplierLanguageCode(
        @Args('data')
        data: SupplierLanguageCodeCreateInput,
    ): Promise<SupplierLanguageCodeEntity | Error> {
        return this._service.create(data);
    }

    //Update SupplierLanguageCode
    @Mutation(() => SupplierLanguageCodeEntity, {
        name: 'updateSupplierLanguageCode',
    })
    public async updateSupplierLanguageCode(
        @Args('data')
        data: SupplierLanguageCodeUpdateInput,
    ): Promise<SupplierLanguageCodeEntity> {
        return this._service.update(data);
    }

    //Remove SupplierLanguageCode
    @Mutation(() => Boolean, {
        name: 'removeSupplierLanguageCode',
    })
    public async removeSupplierLanguageCode(
        @Args('data')
        data: SupplierLanguageCodeRemoveInput,
    ): Promise<boolean> {
        return await this._service.remove(data);
    }
}
