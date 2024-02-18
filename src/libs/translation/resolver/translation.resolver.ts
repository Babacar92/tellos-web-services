import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { AllowPublic } from '../../auth/decorators/allow.public.decorator';
import { TranslationManageTextArg } from '../dto/args/translation.manage.text.arg';
import { TranslationFilterArg } from '../dto/args/translation.filter.arg';
import { TranslationsFrontInterface } from '../dto/interfaces/controller.interfaces';
import { TranslationPaginationResultInterface } from '../dto/interfaces/translation.pagination.result.interface';
import { TranslationService } from '../service/translation.service';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { LoginUserPermissionGuard } from 'src/modules/login/guards/login.user.permission.guard';

/**
 * Translation serveur
 */
@UseGuards(
    LoginUserPermissionGuard)
@Resolver()
export class TranslationResolver {

    public constructor(
        private readonly _service: TranslationService,
    ) { }

    /**
     * Return all texts
     * @returns 
     */
    @AllowPublic()
    @Query(() => JSON, {
        name: 'findPaginationTexts',
    })
    public async findPaginationAll(
        @Args('pagination')
        pagination: PaginationArg,
        @Args('filter')
        filter: TranslationFilterArg,
        @Args('sort')
        sort: DatabaseSortArg,
    ): Promise<TranslationPaginationResultInterface> {
        return this._service.findPaginationAll(pagination, filter, sort);
    }


    /**
     * Return all texts
     * @returns 
     */
    @AllowPublic()
    @Query(() => JSON, {
        name: 'getAllTexts',
    })
    public async getAll(
        filter: TranslationFilterArg,
    ): Promise<TranslationsFrontInterface> {
        return this._service.getAll(filter);
    }

    /**
     * Return all texts
     * @returns 
     */
    @AllowPublic()
    @Mutation(() => JSON, {
        name: 'createNotFoundText',
    })
    public async createNotFoundText(
        @Args('key')
        key: string,
        @Args('domain')
        domain: string,
    ): Promise<TranslationsFrontInterface> {
        return new Promise(async (resolve, reject) => {
            if (key && domain) {
                const data: any = {
                    key: key,
                    domain: domain,
                };

                data[this._service.getDefaultLang()] = key;

                await this._service.manageTextFromRequest(data);

                const texts = await this._service.getAll();

                resolve(texts);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * Save or update text
     * @param TranslationManageTextArg 
     * @returns 
     */
    @Mutation(() => JSON, {
        name: 'manageText',
    })
    public async manageText(
        @Args('TranslationManageTextInput')
        TranslationManageTextArg: TranslationManageTextArg,
    ): Promise<TranslationsFrontInterface> {
        return new Promise(async (resolve, reject) => {

            await this._service.manageTextFromRequest(TranslationManageTextArg.text);

            const texts = await this._service.getAll();

            resolve(texts);
        });
    }

    /**
     * Remove an existing text
     * @param key 
     * @param domain 
     * @returns 
     */
    @Mutation(() => Boolean, {
        name: 'removeText',
    })
    public async remove(
        @Args('key')
        key: string,
        @Args('domain')
        domain: string,
    ): Promise<TranslationsFrontInterface> {
        return new Promise(async (resolve, reject) => {
            await this._service.deleteText(key, domain);

            const texts = await this._service.getAll();

            resolve(texts);
        });
    }

}
