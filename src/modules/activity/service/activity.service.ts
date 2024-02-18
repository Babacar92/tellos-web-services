import { Inject, Injectable } from '@nestjs/common';
import { ActivityEntity } from 'src/entities/psql/ActivityEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { ActivityCreateArgInput } from '../dto/args/activity.create.arg.input';
import { ActivityFilterArgInput } from '../dto/args/activity.filter.arg.input';
import { ActivityRemoveArgInput } from '../dto/args/activity.remove.arg.input';
import { ActivityUpdateArgInput } from '../dto/args/activity.update.arg.input';
import { ActivityPaginationResultInterface } from '../dto/interfaces/activity.pagination.result.interface';
import { ACTIVITY_PROVIDERS_NAMES } from '../dto/provider/activity.providers';
import { ActivityLogger } from '../logger/activity.logger';

enum DatabaseAliasEnum {
  ACTIVITY = 'a',
}

@Injectable()
export class ActivityService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', `${DatabaseAliasEnum.ACTIVITY}.id`],
    ['code', `${DatabaseAliasEnum.ACTIVITY}.code`],
    ['name', `${DatabaseAliasEnum.ACTIVITY}.name`],
    ['active', `${DatabaseAliasEnum.ACTIVITY}.active`],
    ['createdAt', `${DatabaseAliasEnum.ACTIVITY}.createdAt`],
    ['updatedAt', `${DatabaseAliasEnum.ACTIVITY}.updatedAt`],
    ['deletedAt', `${DatabaseAliasEnum.ACTIVITY}.deletedAt`],
    ['createdBy', `${DatabaseAliasEnum.ACTIVITY}.createdBy`],
    ['updatedBy', `${DatabaseAliasEnum.ACTIVITY}.updatedBy`],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   */
  public constructor(
    @Inject(ACTIVITY_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<ActivityEntity>,
    private readonly _logger: ActivityLogger,
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
    id?: number | ActivityEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof ActivityEntity) id = id.id;

    return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
  }

  /**
   * Found Quick Access by column search and is value
   * @param value
   * @param column
   * @param id
   * @param withDeleted
   * @param repo
   * @param manager
   * @returns
   */
  public async existByColumn(
    value: any,
    column: string,
    id?: number | ActivityEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof ActivityEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        `${DatabaseAliasEnum.ACTIVITY}`,
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (ActivityEntity.isColumnString(column)) {
        qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
          column_value: value,
        });
      } else {
        qb.andWhere(`${this._cn(column)} = :column_value`, {
          column_value: value,
        });
      }

      if (id > 0 && column !== 'id')
        qb.andWhere(`${this._cn('id')} != :column_id`, { column_id: id });

      const { total } = await qb.getRawOne();

      resolve(parseInt(total) > 0);
    });
  }

  /**
   * Return all quick access
   * @param filter
   * @param sort
   * @param repo
   * @param manager
   * @returns
   */
  public async findAll(
    filter?: ActivityFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ActivityEntity[]> {
    const qb = this._initSelect(repo, manager);

    await this._applyFilter(qb, filter, sort);

    return qb.getMany();
  }

  /**
   * Return data with pagination
   * @param filter
   * @param sort
   * @param pagination
   * @param repo
   * @param manager
   * @returns
   */
  public async findActivitiesAndPaginationAll(
    filter: ActivityFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ActivityPaginationResultInterface> {
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
    id: number | ActivityEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ActivityEntity> {
    if (id instanceof ActivityEntity) id = id.id;
    return this.findByColumn('id', id, repo, manager);
  }

  /**
   * Return an existing user by his column value
   * @param column
   * @param value
   * @param repo
   * @param manager
   */
  public async findByColumn(
    column: string,
    value: any,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ActivityEntity> {
    const qb = this._initSelect(repo, manager);

    if (ActivityEntity.isColumnString(column)) {
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
   * Create new Quick Access
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async create(
    data: ActivityCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ActivityEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const activity = new ActivityEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(activity, rest);

      // Save hit
      const result = await transaction.save(activity);

      if (result) {
        this._logger.create(activity);

        return this.findOne(result.id, repo, transaction);
      }
    }, manager || repo);
  }

  /**
   * Update new Quick Access
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async update(
    data: ActivityUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ActivityEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldActivity = await this.findOne(id, repo, transaction);

      if (oldActivity) {
        // Set old data
        this._logger.update(oldActivity);

        // Add new Data
        Object.assign(oldActivity, req);

        // Save Data
        const result = await transaction.save(oldActivity);

        if (result) {
          this._logger.update(oldActivity);

          return this.findOne(id, repo, transaction);
        }
      }
    }, manager || repo);
  }

  /**
   * Update an existing entity
   * @param req
   * @param repo
   * @param manager
   * @returns
   */
  public async remove(
    req: ActivityRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof ActivityEntity ? id.id : id;
        const activity = await this.findOne(id, repo, transaction);

        if (activity instanceof ActivityEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(ActivityEntity, activity.id);

            this._logger.delete(activity);
          } else {
            await transaction.softDelete(ActivityEntity, activity.id);

            this._logger.softDelete(activity);
          }

          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }, manager || repo);
  }

  /**
   * Init Select Query Builder
   * @param repo
   * @param manager
   * @returns
   */
  private _initSelect(
    repo?: string,
    manager?: EntityManager,
  ): SelectQueryBuilder<ActivityEntity> {
    return this.getRepo(repo).createQueryBuilder(`${DatabaseAliasEnum.ACTIVITY}`, manager?.queryRunner);
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<ActivityEntity>,
    filter?: ActivityFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      // Search on id
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      // Search on code
      if (filter.code) qb.andWhere(`${this._cn('code')} ILIKE :code`, { code: `%${filter.code}%` });

      if (filter.codes?.length) qb.andWhere(`${this._cn('code')} IN (:...codes)`, { codes: filter.codes });

      // Search on name
      if (filter.name) qb.andWhere(`${this._cn('name')} ILIKE :name`, { name: `%${filter.name}%` });

      if (filter.names?.length) qb.andWhere(`${this._cn('name')} IN (:...names)`, { names: filter.names });

      // General search
      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`(${this._cn('name')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });
          }),
        );
      }
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<ActivityEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return ActivityService.ColumnQueryNames.get(columnName);
  }
}
