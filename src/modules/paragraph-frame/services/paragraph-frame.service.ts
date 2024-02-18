import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from '../../../libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from '../../../libs/services/abstract.repository.service';
import { ParagraphFrameCreateArgInput } from '../dto/args/paragraph-frame.create.arg.input';
import { ParagraphFrameFilterArgInput } from '../dto/args/paragraph-frame.filter.arg.input';
import { ParagraphFrameRemoveArgInput } from '../dto/args/paragraph-frame.remove.arg.input';
import { ParagraphFrameUpdateArgInput } from '../dto/args/paragraph-frame.update.arg.input';
import { ParagraphFramePaginationResultInterface } from '../dto/interfaces/paragraph-frame.pagination.result.interface';
import { PARAGRAPH_FRAME_PROVIDERS_NAMES } from '../dto/provider/paragraph-frame.providers';
import { ParagraphFrameEntity } from 'src/entities/psql/ParagraphFrameEntity';
import { ParagraphFrameLogger } from '../logger/paragraph-frame.logger';

@Injectable()
export class ParagraphFrameService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'pf.id'],
        ['title', 'pf.title'],
        ['category', 'pf.category'],
        ['content', 'pf.content'],
        ['active', 'pf.active'],
        ['createdAt', 'pf.createdAt'],
        ['updatedAt', 'pf.updatedAt'],
        ['deletedAt', 'pf.deletedAt'],
        ['createdBy', 'pf.createdBy'],
        ['updatedBy', 'pf.updatedBy'],
        ['user', 'u.id'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(PARAGRAPH_FRAME_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ParagraphFrameEntity>,
        private readonly _logger: ParagraphFrameLogger,
    ) {
        super();
    }

    /**
     * Check if Quick Access Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | ParagraphFrameEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ParagraphFrameEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found Quick Access by column search and is value
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
        id?: number | ParagraphFrameEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof ParagraphFrameEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('pf', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ParagraphFrameEntity.isColumnString(column)) {
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
     * Return all quick access
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter: ParagraphFrameFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ParagraphFrameEntity[]> {
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
    public async findParagraphFrameAndPaginationAll(
        filter: ParagraphFrameFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ParagraphFramePaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one quick access by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | ParagraphFrameEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ParagraphFrameEntity> {
        if (id instanceof ParagraphFrameEntity) id = id.id;
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
    ): Promise<ParagraphFrameEntity> {
        const qb = this._initSelect(repo, manager);

        if (ParagraphFrameEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: ParagraphFrameCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ParagraphFrameEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const paragraphframe = new ParagraphFrameEntity();

            // Set Data
            Object.assign(paragraphframe, data);

            // Save hit
            const result = await transaction.save(paragraphframe);

            if (result) {
                this._logger.create(paragraphframe);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Quick Access
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: ParagraphFrameUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ParagraphFrameEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldParagraphFrame = await this.findOne(id, repo, transaction);


            if (oldParagraphFrame) {
                // Set old data
                this._logger.setOldData(oldParagraphFrame);

                // Add new Data
                Object.assign(oldParagraphFrame, req);

                // Save Data
                const result = await transaction.save(oldParagraphFrame);

                if (result) {
                    this._logger.update(oldParagraphFrame);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing paragraphframe
     * @param updateParagraphFrame 
     * @param repo 
     * @returns
     */
    public async remove(
        req: ParagraphFrameRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ParagraphFrameEntity ? id.id : id;
                const paragraphframe = await this.findOne(id, repo, transaction);

                if (paragraphframe instanceof ParagraphFrameEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ParagraphFrameEntity, paragraphframe.id);

                        this._logger.delete(paragraphframe);
                    } else {
                        await transaction.softDelete(ParagraphFrameEntity, paragraphframe.id);

                        this._logger.softDelete(paragraphframe);
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
    ): SelectQueryBuilder<ParagraphFrameEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('pf', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ParagraphFrameEntity>,
        filter?: ParagraphFrameFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`${this._cn('title')} ILIKE :search`, { search: `%${filter.search}%` });

                    _qb.orWhere(`${this._cn('content')} ILIKE :search`, { search: `%${filter.search}%` });

                    _qb.orWhere(`${this._cn('category')}::text ILIKE :search`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.title) qb.andWhere(`${this._cn('title')} ILIKE :title`, { title: `%${filter.title}%` });

            if (filter.titles?.length) qb.andWhere(`${this._cn('title')} IN (:...titles)`, { titles: filter.titles });

            if (filter.content) qb.andWhere(`${this._cn('content')} ILIKE :content`, { content: `%${filter.content}%` });

            if (filter.contents?.length) qb.andWhere(`${this._cn('content')} IN (:...contents)`, { contents: filter.contents });

            if (filter.category) qb.andWhere(`${this._cn('category')}::text ILIKE :category`, { category: `%${filter.category}%` });

            if (filter.categories?.length) qb.andWhere(`${this._cn('category')}::text IN (:...categories)`, { categories: filter.categories });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<ParagraphFrameEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ParagraphFrameService.ColumnQueryNames.get(columnName);
    }

}
