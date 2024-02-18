import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from 'src/entities/psql/NotificationEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { NotificationFilterArgInput } from '../dto/args/notification.filter.arg.input';
import { NOTIFICATION_PROVIDERS_NAMES } from '../dto/provider/notification.providers';
import { ActionLogService } from 'src/modules/action-log/services/action-log.service';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { NotificationPaginationResultInterface } from '../dto/interfaces/notification.pagination.result.interface';
import { NotificationCreateArgInput } from '../dto/args/notification.create.arg.input';
import { NotificationUpdateArgInput } from '../dto/args/notification.update.arg.input';
import { NotificationRemoveArgInput } from '../dto/args/notification.remove.arg.input';
import { getCurrentUser } from 'src/libs/databases/utils/db.utils';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { ACTION_LOG_TYPES } from 'src/modules/action-log/dto/types/actions.types.enum';
import { LoginEntity } from 'src/entities/psql/LoginEntity';
import { NotificationLoginEntity } from 'src/entities/psql/NotificationLoginEntity';
import { resolve } from 'path';
import { GraphqlWebsocketService } from 'src/libs/graphql/service/graphql.websocket.service';
import { dump } from 'src/utils/utils';
import { NotificationTypeService } from 'src/modules/notification-type/service/notification-type.service';

@Injectable()
export class NotificationService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'n.id'],
        ['category', 'n.category'],
        ['loginId', 'l.id'],
        ['typeId', 't.id'],
        ['typeTitle', 't.title'],
        ['active', 'n.active'],
        ['createdAt', 'n.createdAt'],
        ['updatedAt', 'n.updatedAt'],
        ['deletedAt', 'n.deletedAt'],
        ['createdBy', 'n.createdBy'],
        ['updatedBy', 'n.updatedBy'],
    ]);
    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(NOTIFICATION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<NotificationEntity>,
        private readonly _actionLogService: ActionLogService,
        private readonly _gqlWsService: GraphqlWebsocketService,
        private readonly _typeService: NotificationTypeService,
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
        id?: number | NotificationEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof NotificationEntity) id = id.id;

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
        id?: number | NotificationEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof NotificationEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('n', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (NotificationEntity.isColumnString(column)) {
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
        filter?: NotificationFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationEntity[]> {
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
    public async findNotificationsAndPaginationAll(
        filter: NotificationFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        sort = Object.assign(sort || {}, <DatabaseSortArg>{
            createdAt: 'DESC',
        });

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
        id: number | NotificationEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationEntity> {
        if (id instanceof NotificationEntity) id = id.id;
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
    ): Promise<NotificationEntity> {
        const qb = this._initSelect(repo, manager);

        if (NotificationEntity.isColumnString(column)) {
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
        data: NotificationCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const notification = new NotificationEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(notification, rest);

            // Save hit
            const result = await transaction.save(notification);

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
        data: NotificationUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<NotificationEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldNotification = await this.findOne(id, repo, transaction);

            if (oldNotification) {

                // Add new Data
                Object.assign(oldNotification, req);

                // Save Data
                const result = await transaction.save(oldNotification);

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
        req: NotificationRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof NotificationEntity ? id.id : id;
                const notification = await this.findOne(id, repo, transaction);

                if (notification instanceof NotificationEntity) {
                    const user = getCurrentUser();

                    if (type === REMOVE_TYPES.HARD) {

                        await transaction.delete(NotificationEntity, notification.id);

                        if (user) {
                            this._actionLogService.log({
                                type: ACTION_LOG_TYPES.NOTIFICATION_DELETE,
                                user: {
                                    id: user.sub,
                                    entity: LoginEntity.name,
                                },
                                data: <NotificationEntity>{
                                    id: notification.id,
                                },
                            });
                        }
                    } else {
                        await transaction.softDelete(NotificationEntity, notification.id);

                        if (user) {
                            this._actionLogService.log({
                                type: ACTION_LOG_TYPES.NOTIFICATION_SOFT_DELETE,
                                user: {
                                    id: user.sub,
                                    entity: LoginEntity.name,
                                },
                                data: <NotificationEntity>{
                                    id: notification.id,
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
     * Mark all notification as read if exist
     * @param notificationType 
     * @param userId 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async markAllNotificationsAsRead(
        userId: number,
        notificationType: number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            // Get the repository
            const repository = transaction
                .getRepository(NotificationLoginEntity);

            // Prepare select query builder to get all not read
            const sqb = repository
                .createQueryBuilder('nl', transaction.queryRunner)
                .select('nl.id', 'nl_id')
                .leftJoin('nl.login', 'l')
                .leftJoin('nl.notification', 'n')
                .leftJoin('n.type', 't')
                .andWhere('l.id = :l_id', { l_id: userId })
                .andWhere('nl.isRead = false');

            // Add filter by type
            if (notificationType) sqb.andWhere('t.id = :t_id', { t_id: notificationType });

            // Get the ids
            const ids: number[] = (await sqb.getRawMany()).map((row: any) => row.nl_id);

            let success: boolean = false;

            if (ids.length) {
                const res = await repository.update(ids, { isRead: true });
                success = !!res.affected;
            }

            this.returnTotal(userId, repo, transaction);

            return success;
        }, (manager || repo));
    }

    /**
     * Mark all notification as read if exist
     * @param notificationId 
     * @param userId 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async markNotificationAsRead(
        userId: number,
        notificationId: number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            // Get the repository
            const repository = transaction
                .getRepository(NotificationLoginEntity);

            // Prepare select query builder to get all not read
            const sqb = repository
                .createQueryBuilder('nl', transaction.queryRunner)
                .select('nl.id', 'nl_id')
                .leftJoin('nl.login', 'l')
                .leftJoin('nl.notification', 'n')
                .leftJoin('n.type', 't')
                .andWhere('l.id = :l_id', { l_id: userId })
                .andWhere('nl.id = :nl_id', { nl_id: notificationId })
                .andWhere('nl.isRead = false');

            // Get the id
            const id: number = (await sqb.getRawOne())?.nl_id;

            let success: boolean = false;

            if (id) {
                const res = await repository.update(id, { isRead: true });
                success = !!res.affected;
            }

            this.returnTotal(userId, repo, transaction);

            return success;
        }, (manager || repo));
    }

    /**
     * 
     * @param userId 
     */
    public async returnTotal(
        userId: number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const { total } = await this.getRepo(repo)
                .createQueryBuilder('n', manager?.queryRunner)
                .select('COUNT(n.id)', 'total')
                .leftJoin('n.info', 'i')
                .andWhere('i.login = :login', { login: userId })
                .andWhere('i.isRead = false')
                .getRawOne();

            this._gqlWsService.publish('getCountNotification', total, userId);

            resolve(total);
        });
    }

    /**
     * Init Select Query Builder
     * @param repo 
     * @returns 
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<NotificationEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('n', manager?.queryRunner)
            .leftJoinAndSelect('n.info', 'i')
            .leftJoin('i.login', 'l')
            .leftJoinAndSelect('n.type', 't');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<NotificationEntity>,
        filter?: NotificationFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('category')}::text ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('typeTitle')} ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.category) qb.andWhere(`${this._cn('category')}::text ILIKE :category`, { category: `%${filter.category}%` });

            if (filter.categories?.length) qb.andWhere(`${this._cn('category')} IN (:...categories)`, { categories: filter.categories });

            if (filter.typeTitle) qb.andWhere(`${this._cn('typeTitle')} ILIKE :typeTitle`, { typeTitle: `%${filter.typeTitle}%` });

            if (filter.typeTitles?.length) qb.andWhere(`${this._cn('typeTitle')} IN (:...typeTitles)`, { typeTitles: filter.typeTitles });

            if (filter.loginId) qb.andWhere(`${this._cn('loginId')} = :loginId`, { loginId: filter.loginId });

            if (filter.loginIds?.length) qb.andWhere(`${this._cn('loginId')} IN (:...loginIds)`, { loginIds: filter.loginIds });

            if (filter.typeId) qb.andWhere(`${this._cn('typeId')} = :typeId`, { typeId: filter.typeId });

            if (filter.typeIds?.length) qb.andWhere(`${this._cn('typeId')} IN (:...typeIds)`, { typeIds: filter.typeIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<NotificationEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return NotificationService.ColumnQueryNames.get(columnName);
    }

}
