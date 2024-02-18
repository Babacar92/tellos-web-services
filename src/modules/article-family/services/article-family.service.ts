import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ArticleFamilyEntity } from '../../../entities/psql/ArticleFamilyEntity';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from '../../../libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from '../../../libs/services/abstract.repository.service';
import { ArticleFamilyCreateArgInput } from '../dto/args/article-family.create.arg.input';
import { ArticleFamilyFilterArgInput } from '../dto/args/article-family.filter.arg.input';
import { ArticleFamilyRemoveArgInput } from '../dto/args/article-family.remove.arg.input';
import { ArticleFamilyUpdateArgInput } from '../dto/args/article-family.update.arg.input';
import { ArticleFamilyPaginationResultInterface } from '../dto/interfaces/article-family.pagination.result.interface';
import { ARTICLE_FAMILY_PROVIDERS_NAMES } from '../dto/provider/article-family.providers';
import { ArticleFamilyLogger } from '../logger/article-family.logger';

export enum DatabaseAliasEnum {
    ARTICLE_FAMILY = 'af',
    ARTICLE_FAMILY_PARENT = 'afp',
    ARTICLE_FAMILY_CHILDREN = 'afc',
    SECTION_CODE = 'sc'
}
@Injectable()
export class ArticleFamilyService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', `${DatabaseAliasEnum.ARTICLE_FAMILY}.id`],
        ['label', `${DatabaseAliasEnum.ARTICLE_FAMILY}.label`],
        ['parent', `${DatabaseAliasEnum.ARTICLE_FAMILY_PARENT}.id`],
        ['sectionCode', `${DatabaseAliasEnum.SECTION_CODE}.id`],
        ['active', `${DatabaseAliasEnum.ARTICLE_FAMILY}.active`],
        ['createdAt', `${DatabaseAliasEnum.ARTICLE_FAMILY}.createdAt`],
        ['updatedAt', `${DatabaseAliasEnum.ARTICLE_FAMILY}.updatedAt`],
        ['deletedAt', `${DatabaseAliasEnum.ARTICLE_FAMILY}.deletedAt`],
        ['createdBy', `${DatabaseAliasEnum.ARTICLE_FAMILY}.createdBy`],
        ['updatedBy', `${DatabaseAliasEnum.ARTICLE_FAMILY}.updatedBy`],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(ARTICLE_FAMILY_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ArticleFamilyEntity>,
        private readonly _logger: ArticleFamilyLogger,
    ) {
        super();
    }

    /**
     * Check if Article Family Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | ArticleFamilyEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ArticleFamilyEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Check if Article Family Is a Child of a parent family
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async isChildOf(
        parent?: number | ArticleFamilyEntity,
        child?: number | ArticleFamilyEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (child instanceof ArticleFamilyEntity) child = child.id;
            if (parent instanceof ArticleFamilyEntity) parent = parent.id;

            const result = await this.getRepo(repo)
                .createQueryBuilder(`${DatabaseAliasEnum.ARTICLE_FAMILY}`, manager?.queryRunner)
                .select(`${DatabaseAliasEnum.ARTICLE_FAMILY}.id`, 'id')
                .andWhere(`${DatabaseAliasEnum.ARTICLE_FAMILY}.id = :id`, {id: child})
                .andWhere(`${DatabaseAliasEnum.ARTICLE_FAMILY}.parent = :parent`, {parent: parent})
                .getRawOne();
            
            resolve(!!result?.id)
        })
    }

    /**
     * Found Article Family by column search and his value
     * @param value 
     * @param column 
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @returns 
     */
    public async existByColumn(
        value: any,
        column: string,
        id?: number | ArticleFamilyEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (id instanceof ArticleFamilyEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder(`${DatabaseAliasEnum.ARTICLE_FAMILY}`, manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ArticleFamilyEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
            }

            if (id > 0 && column !== "id") qb.andWhere(`${this._cn('id')} != :column_id`, { column_id: id });

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    /**
     * Return all article family
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter: ArticleFamilyFilterArgInput,
        sort: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ArticleFamilyEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }

    /**
     * Return data with pagination
     * @param sort 
     * @param pagination 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findArticleFamilyAndPaginationAll(
        filter: ArticleFamilyFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ArticleFamilyPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one article family by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | ArticleFamilyEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ArticleFamilyEntity> {
        if (id instanceof ArticleFamilyEntity) id = id.id;
        return this.findByColumn("id", id, repo, manager);
    }

    /**
     * Return an existing user by his column value
     * @param column 
     * @param value 
     * @param repo 
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ArticleFamilyEntity> {
        const qb = this._initSelect(repo, manager);

        if (ArticleFamilyEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Article Family
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: ArticleFamilyCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ArticleFamilyEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Article Family
            const articleFamily = new ArticleFamilyEntity();

            // Set Data
            Object.assign(articleFamily, data);

            // Save hit
            const result = await transaction.save(articleFamily);

            if (result) {
                this._logger.create(articleFamily);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Article Family
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: ArticleFamilyUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ArticleFamilyEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldArticleFamily = await this.findOne(id, repo, transaction);


            if (oldArticleFamily) {
                // Set old data
                this._logger.setOldData(oldArticleFamily);

                // Add new Data
                Object.assign(oldArticleFamily, req);

                // Save Data
                const result = await transaction.save(oldArticleFamily);

                if (result) {
                    this._logger.update(oldArticleFamily);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing articlefamily
     * @param updateArticleFamily 
     * @param repo 
     * @returns
     */
    public async remove(
        req: ArticleFamilyRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ArticleFamilyEntity ? id.id : id;
                const articlefamily = await this.findOne(id, repo, transaction);

                if (articlefamily instanceof ArticleFamilyEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ArticleFamilyEntity, articlefamily.id);

                        this._logger.delete(articlefamily);
                    } else {
                        await transaction.softDelete(ArticleFamilyEntity, articlefamily.id);

                        this._logger.softDelete(articlefamily);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, (manager || repo));
    }

    /**
     * Init Select Query Builder
     * @param repo 
     * @returns 
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<ArticleFamilyEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder(`${DatabaseAliasEnum.ARTICLE_FAMILY}`, manager?.queryRunner)
            .leftJoinAndSelect(`${DatabaseAliasEnum.ARTICLE_FAMILY}.parent`, DatabaseAliasEnum.ARTICLE_FAMILY_PARENT)
            .leftJoinAndSelect(`${DatabaseAliasEnum.ARTICLE_FAMILY}.children`, DatabaseAliasEnum.ARTICLE_FAMILY_CHILDREN)
            .leftJoinAndSelect(`${DatabaseAliasEnum.ARTICLE_FAMILY}.sectionCode`, DatabaseAliasEnum.SECTION_CODE)

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ArticleFamilyEntity>,
        filter?: ArticleFamilyFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`${this._cn('label')} ILIKE :search`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.parentId) qb.andWhere(`${this._cn('parent')} = :id`, { id: filter.parentId });

            if (filter.parentIds?.length) qb.andWhere(`${this._cn('parent')} IN (:...ids)`, { ids: filter.parentIds });

            if (filter.label) qb.andWhere(`${this._cn('label')} ILIKE :label`, { label: `%${filter.label}%` });

            if (filter.labels?.length) qb.andWhere(`${this._cn('label')} IN (:...labels)`, { labels: filter.labels });

            if (filter.sectionCode) qb.andWhere(`${this._cn('sectionCode')} = :sectionCode`, { sectionCode: `${filter.sectionCode}` });

            if (filter.sectionCodes?.length) qb.andWhere(`${this._cn('sectionCode')} IN (:...sectionCodes)`, { sectionCodes: filter.sectionCodes });

            if (typeof filter.availableForChild === 'boolean' && filter.availableForChild) {
                qb.andWhere(`${this._cn('parent')} IS NULL`);
                qb.andWhere(`${this._cn('sectionCode')} IS NULL`);
            }

            if (typeof filter.availableForParent === 'boolean' && filter.availableForParent) {
                qb.andWhere(`${this._cn('sectionCode')} IS NOT NULL`);
            }
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<ArticleFamilyEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ArticleFamilyService.ColumnQueryNames.get(columnName);
    }

}
