import { Inject, Injectable } from '@nestjs/common';
import { NotificationTypeEntity } from 'src/entities/psql/NotificationTypeEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { getCurrentUser } from 'src/libs/databases/utils/db.utils';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { ACTION_LOG_TYPES } from 'src/modules/action-log/dto/types/actions.types.enum';
import { ActionLogService } from 'src/modules/action-log/services/action-log.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { NotificationTypeCreateArgInput } from '../dto/args/notification-type.create.arg.input';
import { NotificationTypeFilterArgInput } from '../dto/args/notification-type.filter.arg.input';
import { NotificationTypeRemoveArgInput } from '../dto/args/notification-type.remove.arg.input';
import { NotificationTypeUpdateArgInput } from '../dto/args/notification-type.update.arg.input';
import { NotificationTypePaginationResultInterface } from '../dto/interfaces/notification-type.pagination.result.interface';
import { NOTIFICATION_TYPE_PROVIDERS_NAMES } from '../dto/provider/notification-type.providers';
import { LoginEntity } from 'src/entities/psql/LoginEntity';

@Injectable()
export class NotificationTypeService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'nt.id'],
        ['title', 'nt.title'],
        ['icon', 'nt.icon'],
        ['active', 'nt.active'],
        ['createdAt', 'nt.createdAt'],
        ['updatedAt', 'nt.updatedAt'],
        ['deletedAt', 'nt.deletedAt'],
        ['createdBy', 'nt.createdBy'],
        ['updatedBy', 'nt.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(NOTIFICATION_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<NotificationTypeEntity>,
        private readonly _actionLogService: ActionLogService,
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
        id?: number | NotificationTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof NotificationTypeEntity) id = id.id;

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
        id?: number | NotificationTypeEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof NotificationTypeEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('nt', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (NotificationTypeEntity.isColumnString(column)) {
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
        filter?: NotificationTypeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationTypeEntity[]> {
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
    public async findNotificationTypesAndPaginationAll(
        filter: NotificationTypeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationTypePaginationResultInterface> {
        return new Promise(async (resolve, reject) => {
            const qb = this._initSelect(
                repo,
                manager,
            );

            await this._applyFilter(qb, filter, sort);

            const result = await qb.getManyAndPaginate(pagination);

            if (filter.targetLogin) {
                for (const i in result.result) {
                    const row = result.result[i];

                    const { total } = await this.getRepo(repo)
                        .createQueryBuilder('nt', manager?.queryRunner)
                        .select('COUNT(n.id)', 'total')
                        .leftJoin('nt.notifications', 'n')
                        .leftJoin('n.info', 'i')
                        .leftJoin('i.login', 'l')
                        .andWhere('l.id = :l_id', { l_id: filter.targetLogin })
                        .andWhere('nt.id = :nt_id', { nt_id: row.id })
                        .andWhere('i.isRead = false')
                        .getRawOne();

                    row.total = total;
                }
            }

            resolve(result);
        });
    }

    /**
     * Return one quick access by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | NotificationTypeEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationTypeEntity> {
        if (id instanceof NotificationTypeEntity) id = id.id;
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
    ): Promise<NotificationTypeEntity> {
        const qb = this._initSelect(repo, manager);

        if (NotificationTypeEntity.isColumnString(column)) {
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
        data: NotificationTypeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationTypeEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const notificationType = new NotificationTypeEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(notificationType, rest);

            // Save hit
            const result = await transaction.save(notificationType);

            if (result) {
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
        data: NotificationTypeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationTypeEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldNotificationType = await this.findOne(id, repo, transaction);

            if (oldNotificationType) {

                // Add new Data
                Object.assign(oldNotificationType, req);

                // Save Data
                const result = await transaction.save(oldNotificationType);

                if (result) {
                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing entity
     * @param updateEntity 
     * @param repo 
     * @returns
     */
    public async remove(
        req: NotificationTypeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof NotificationTypeEntity ? id.id : id;
                const notificationType = await this.findOne(id, repo, transaction);

                if (notificationType instanceof NotificationTypeEntity) {
                    const user = getCurrentUser();

                    if (type === REMOVE_TYPES.HARD) {

                        await transaction.delete(NotificationTypeEntity, notificationType.id);

                        if (user) {
                            this._actionLogService.log({
                                type: ACTION_LOG_TYPES.NOTIFICATION_TYPE_DELETE,
                                user: {
                                    id: user.sub,
                                    entity: LoginEntity.name,
                                },
                                data: <NotificationTypeEntity>{
                                    id: notificationType.id,
                                    title: notificationType.title,
                                },
                            });
                        }
                    } else {
                        await transaction.softDelete(NotificationTypeEntity, notificationType.id);

                        if (user) {
                            this._actionLogService.log({
                                type: ACTION_LOG_TYPES.NOTIFICATION_TYPE_SOFT_DELETE,
                                user: {
                                    id: user.sub,
                                    entity: LoginEntity.name,
                                },
                                data: <NotificationTypeEntity>{
                                    id: notificationType.id,
                                    title: notificationType.title,
                                },
                            });
                        }
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
    ): SelectQueryBuilder<NotificationTypeEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('nt', manager?.queryRunner);

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<NotificationTypeEntity>,
        filter?: NotificationTypeFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('icon')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.title) qb.andWhere(`${this._cn('title')} ILIKE :title`, { title: `%${filter.title}%` });

            if (filter.titles?.length) qb.andWhere(`${this._cn('title')} IN (:...titles)`, { titles: filter.titles });

            if (filter.icon) qb.andWhere(`${this._cn('icon')} ILIKE :icon`, { icon: `%${filter.icon}%` });

            if (filter.icons?.length) qb.andWhere(`${this._cn('icon')} IN (:...icons)`, { icons: filter.icons });

        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<NotificationTypeEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return NotificationTypeService.ColumnQueryNames.get(columnName);
    }

}
