import { Inject, Injectable } from '@nestjs/common';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import {
    Brackets,
    EntityManager,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { AbstractRepositoryService } from '../../../libs/services/abstract.repository.service';
import { ActionLogService } from '../../action-log/services/action-log.service';
import { PermissionFilterArgInput } from '../dto/args/permission.filter.arg.input';
import { PermissionPaginationResultInterface } from '../dto/interfaces/permission.pagination.result.interface';
import { PERMISSION_PROVIDERS_NAMES } from '../dto/provider/permission.providers';
import { PermissionEntity } from 'src/entities/psql/PermissionEntity';

@Injectable()
export class PermissionService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'r.id'],
        ['name', 'r.name'],
        ['active', 'r.active'],
        ['createdAt', 'r.createdAt'],
        ['updatedAt', 'r.updatedAt'],
        ['deletedAt', 'r.deletedAt'],
        ['createdBy', 'r.createdBy'],
        ['updatedBy', 'r.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(PERMISSION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<PermissionEntity>,
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
        id?: number | PermissionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof PermissionEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
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
        id?: number | PermissionEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof PermissionEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'r',
                manager?.queryRunner,
            );

            // Value type
            const isValueArray = value instanceof Array;

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (isValueArray) {
                qb.andWhere(`${this._cn(column)} IN (:...column_value)`, {
                    column_value: value.map((v: any) =>
                        v instanceof PermissionEntity ? v.id : v,
                    ),
                });
            } else if (PermissionEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, {
                    column_value: value,
                });
            }

            if (id > 0 && column !== 'id')
                qb.andWhere(`${this._cn('id')} != :column_id`, {
                    column_id: id,
                });

            let { total } = await qb.getRawOne();

            total = parseInt(total);

            resolve(!isValueArray ? total > 0 : total === value.length);
        });
    }

    /**
     * Return all quick access
     * @param repo
     * @returns
     */
    public async findAll(
        filter: PermissionFilterArgInput,
        sort: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PermissionEntity[]> {
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
    public async findPermissionAndPaginationAll(
        filter: PermissionFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PermissionPaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

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
        id: number | PermissionEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PermissionEntity> {
        if (id instanceof PermissionEntity) id = id.id;
        return this.findByColumn('id', id, repo, manager);
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
    ): Promise<PermissionEntity> {
        const qb = this._initSelect(repo, manager);

        if (PermissionEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                column_value: value,
            });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, {
                column_value: value,
            });
        }

        return qb.getOne();
    }

    /**
     * Init Select Query Builder
     * @param repo
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<PermissionEntity> {
        const qb = this.getRepo(repo).createQueryBuilder(
            'r',
            manager?.queryRunner,
        );

        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<PermissionEntity>,
        filter?: PermissionFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`${this._cn('name')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                    }),
                );
            }

            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.name)
                qb.andWhere(`${this._cn('name')} ILIKE :name`, {
                    name: `%${filter.name}%`,
                });

            if (filter.names?.length)
                qb.andWhere(`${this._cn('name')} IN (:...names)`, {
                    names: filter.names,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<PermissionEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return PermissionService.ColumnQueryNames.get(columnName);
    }
}
