import { Inject, Injectable } from '@nestjs/common';
import { ZoneEntity } from 'src/entities/psql/ZoneEntity';
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
import { ZoneCreateArgInput } from '../dto/args/zone.create.arg.input';
import { ZoneFilterArgInput } from '../dto/args/zone.filter.arg.input';
import { ZoneRemoveArgInput } from '../dto/args/zone.remove.arg.input';
import { ZoneUpdateArgInput } from '../dto/args/zone.update.arg.input';
import { ZonePaginationResultInterface } from '../dto/interfaces/zone.pagination.result.interface';
import { ZONE_PROVIDERS_NAMES } from '../dto/provider/zone.providers';
import { ZoneLogger } from '../logger/zone.logger';

enum DatabaseAliasEnum {
  ZONE = 'z',
}

@Injectable()
export class ZoneService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', `${DatabaseAliasEnum.ZONE}.id`],
    ['code', `${DatabaseAliasEnum.ZONE}.code`],
    ['active', `${DatabaseAliasEnum.ZONE}.active`],
    ['createdAt', `${DatabaseAliasEnum.ZONE}.createdAt`],
    ['updatedAt', `${DatabaseAliasEnum.ZONE}.updatedAt`],
    ['deletedAt', `${DatabaseAliasEnum.ZONE}.deletedAt`],
    ['createdBy', `${DatabaseAliasEnum.ZONE}.createdBy`],
    ['updatedBy', `${DatabaseAliasEnum.ZONE}.updatedBy`],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   */
  public constructor(
    @Inject(ZONE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<ZoneEntity>,
    private readonly _logger: ZoneLogger,
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
    id?: number | ZoneEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof ZoneEntity) id = id.id;

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
    id?: number | ZoneEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof ZoneEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        `${DatabaseAliasEnum.ZONE}`,
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (ZoneEntity.isColumnString(column)) {
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
    filter?: ZoneFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ZoneEntity[]> {
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
  public async findZonesAndPaginationAll(
    filter: ZoneFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ZonePaginationResultInterface> {
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
    id: number | ZoneEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ZoneEntity> {
    if (id instanceof ZoneEntity) id = id.id;
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
  ): Promise<ZoneEntity> {
    const qb = this._initSelect(repo, manager);

    if (ZoneEntity.isColumnString(column)) {
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
    data: ZoneCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ZoneEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const zone = new ZoneEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(zone, rest);

      // Save hit
      const result = await transaction.save(zone);

      if (result) {
        this._logger.create(zone);

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
    data: ZoneUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ZoneEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldZone = await this.findOne(id, repo, transaction);

      if (oldZone) {
        // Set old data
        this._logger.update(oldZone);

        // Add new Data
        Object.assign(oldZone, req);

        // Save Data
        const result = await transaction.save(oldZone);

        if (result) {
          this._logger.update(oldZone);

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
    req: ZoneRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof ZoneEntity ? id.id : id;
        const zone = await this.findOne(id, repo, transaction);

        if (zone instanceof ZoneEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(ZoneEntity, zone.id);

            this._logger.delete(zone);
          } else {
            await transaction.softDelete(ZoneEntity, zone.id);

            this._logger.softDelete(zone);
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
  ): SelectQueryBuilder<ZoneEntity> {
    return this.getRepo(repo).createQueryBuilder(`${DatabaseAliasEnum.ZONE}`, manager?.queryRunner);
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<ZoneEntity>,
    filter?: ZoneFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      // Search on id
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      // Search on code
      if (filter.code) qb.andWhere(`${this._cn('code')} ILIKE :code`, { code: `%${filter.code}%` });

      if (filter.codes?.length) qb.andWhere(`${this._cn('code')} IN (:...codes)`, { codes: filter.codes, });

      // General search
      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });
          }),
        );
      }
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<ZoneEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return ZoneService.ColumnQueryNames.get(columnName);
  }
}
