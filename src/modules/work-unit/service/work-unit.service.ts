import { Inject, Injectable } from '@nestjs/common';
import { WorkUnitEntity } from 'src/entities/psql/WorkUnitEntity';
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
import { WorkUnitCreateArgInput } from '../dto/args/work-unit.create.arg.input';
import { WorkUnitFilterArgInput } from '../dto/args/work-unit.filter.arg.input';
import { WorkUnitRemoveArgInput } from '../dto/args/work-unit.remove.arg.input';
import { WorkUnitUpdateArgInput } from '../dto/args/work-unit.update.arg.input';
import { WorkUnitPaginationResultInterface } from '../dto/interfaces/work-unit.pagination.result.interface';
import { WORK_UNIT_PROVIDERS_NAMES } from '../dto/provider/work-unit.providers';
import { WorkUnitLogger } from '../logger/work-unit.logger';

@Injectable()
export class WorkUnitService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'dt.id'],
    ['title', 'dt.title'],
    ['divisionFactor', 'dt.divisionFactor'],
    ['active', 'dt.active'],
    ['createdAt', 'dt.createdAt'],
    ['updatedAt', 'dt.updatedAt'],
    ['deletedAt', 'dt.deletedAt'],
    ['createdBy', 'dt.createdBy'],
    ['updatedBy', 'dt.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   */
  public constructor(
    @Inject(WORK_UNIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<WorkUnitEntity>,
    private readonly _logger: WorkUnitLogger,
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
    id?: number | WorkUnitEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof WorkUnitEntity) id = id.id;

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
    id?: number | WorkUnitEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof WorkUnitEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'dt',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (WorkUnitEntity.isColumnString(column)) {
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
    filter?: WorkUnitFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkUnitEntity[]> {
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
  public async findWorkUnitsAndPaginationAll(
    filter: WorkUnitFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkUnitPaginationResultInterface> {
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
    id: number | WorkUnitEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkUnitEntity> {
    if (id instanceof WorkUnitEntity) id = id.id;
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
  ): Promise<WorkUnitEntity> {
    const qb = this._initSelect(repo, manager);

    if (WorkUnitEntity.isColumnString(column)) {
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
    data: WorkUnitCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkUnitEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const workUnit = new WorkUnitEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(workUnit, rest);

      // Save hit
      const result = await transaction.save(workUnit);

      if (result) {
        this._logger.create(workUnit);

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
    data: WorkUnitUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkUnitEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldWorkUnit = await this.findOne(id, repo, transaction);

      if (oldWorkUnit) {
        // Set old data
        this._logger.update(oldWorkUnit);

        // Add new Data
        Object.assign(oldWorkUnit, req);

        // Save Data
        const result = await transaction.save(oldWorkUnit);

        if (result) {
          this._logger.update(oldWorkUnit);

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
    req: WorkUnitRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof WorkUnitEntity ? id.id : id;
        const workUnit = await this.findOne(id, repo, transaction);

        if (workUnit instanceof WorkUnitEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(WorkUnitEntity, workUnit.id);

            this._logger.delete(workUnit);
          } else {
            await transaction.softDelete(WorkUnitEntity, workUnit.id);

            this._logger.softDelete(workUnit);
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
  ): SelectQueryBuilder<WorkUnitEntity> {
    return this.getRepo(repo).createQueryBuilder('dt', manager?.queryRunner);
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<WorkUnitEntity>,
    filter?: WorkUnitFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      if (filter.divisionFactor) qb.andWhere(`${this._cn('divisionFactor')} = :divisionFactor`, { divisionFactor: filter.divisionFactor });

      if (filter.divisionFactors?.length)
        qb.andWhere(`${this._cn('divisionFactor')} IN (:...divisionFactors)`, { divisionFactors: filter.divisionFactors });

      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhere(`(${this._cn('title')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });
          }),
        );
      }

      if (filter.title)
        qb.andWhere(`${this._cn('title')} ILIKE :title`, {
          title: `%${filter.title}%`,
        });

      if (filter.titles?.length)
        qb.andWhere(`${this._cn('title')} IN (:...titles)`, {
          titles: filter.titles,
        });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<WorkUnitEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return WorkUnitService.ColumnQueryNames.get(columnName);
  }
}
