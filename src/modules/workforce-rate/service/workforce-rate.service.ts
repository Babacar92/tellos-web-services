import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { WorkforceRateEntity } from 'src/entities/psql/WorkforceRateEntity';
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
import { WorkforceRateCreateArgInput } from '../dto/args/workforce-rate.create.arg.input';
import { WorkforceRateFilterArgInput } from '../dto/args/workforce-rate.filter.arg.input';
import { WorkforceRateRemoveArgInput } from '../dto/args/workforce-rate.remove.arg.input';
import { WorkforceRateUpdateArgInput } from '../dto/args/workforce-rate.update.arg.input';
import { WorkforceRatePaginationResultInterface } from '../dto/interfaces/workforce-rate.pagination.result.interface';
import { WORKFORCE_RATE_PROVIDERS_NAMES } from '../dto/provider/workforce-rate.providers';
import { WorkforceRateLogger } from '../logger/workforce-rate.logger';
import { SectionCodeService } from 'src/modules/section-code/service/section-code.service';

enum DatabaseAliasEnum {
  WORKFORCE_RATE = 'wfr',
  ENTITIES = 'ent',
  WORK_UNIT = 'wu',
  SECTION_CODE = 'sc'
}

@Injectable()
export class WorkforceRateService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', `${DatabaseAliasEnum.WORKFORCE_RATE}.id`],
    ['price', `${DatabaseAliasEnum.WORKFORCE_RATE}.price`],
    ['active', `${DatabaseAliasEnum.WORKFORCE_RATE}.active`],
    ['entity', `${DatabaseAliasEnum.ENTITIES}.id`],
    ['workUnit', `${DatabaseAliasEnum.WORK_UNIT}.id`],
    ['entity', `${DatabaseAliasEnum.SECTION_CODE}.id`],
    ['createdAt', `${DatabaseAliasEnum.WORKFORCE_RATE}.createdAt`],
    ['updatedAt', `${DatabaseAliasEnum.WORKFORCE_RATE}.updatedAt`],
    ['deletedAt', `${DatabaseAliasEnum.WORKFORCE_RATE}.deletedAt`],
    ['createdBy', `${DatabaseAliasEnum.WORKFORCE_RATE}.createdBy`],
    ['updatedBy', `${DatabaseAliasEnum.WORKFORCE_RATE}.updatedBy`],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   */
  public constructor(
    @Inject(WORKFORCE_RATE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<WorkforceRateEntity>,
    private readonly _logger: WorkforceRateLogger
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
    id?: number | WorkforceRateEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof WorkforceRateEntity) id = id.id;

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
    id?: number | WorkforceRateEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof WorkforceRateEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        `${DatabaseAliasEnum.WORKFORCE_RATE}`,
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (WorkforceRateEntity.isColumnString(column)) {
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
    filter?: WorkforceRateFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkforceRateEntity[]> {
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
  public async findWorkforceRatesAndPaginationAll(
    filter: WorkforceRateFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkforceRatePaginationResultInterface> {
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
    id: number | WorkforceRateEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkforceRateEntity> {
    if (id instanceof WorkforceRateEntity) id = id.id;
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
  ): Promise<WorkforceRateEntity> {
    const qb = this._initSelect(repo, manager);

    if (WorkforceRateEntity.isColumnString(column)) {
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
    data: WorkforceRateCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkforceRateEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const workUnit = new WorkforceRateEntity();

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
    data: WorkforceRateUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<WorkforceRateEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldWorkforceRate = await this.findOne(id, repo, transaction);

      if (oldWorkforceRate) {
        // Set old data
        this._logger.update(oldWorkforceRate);

        // Add new Data
        Object.assign(oldWorkforceRate, req);

        // Save Data
        const result = await transaction.save(oldWorkforceRate);

        if (result) {
          this._logger.update(oldWorkforceRate);

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
    req: WorkforceRateRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof WorkforceRateEntity ? id.id : id;
        const workUnit = await this.findOne(id, repo, transaction);

        if (workUnit instanceof WorkforceRateEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(WorkforceRateEntity, workUnit.id);

            this._logger.delete(workUnit);
          } else {
            await transaction.softDelete(WorkforceRateEntity, workUnit.id);

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
  ): SelectQueryBuilder<WorkforceRateEntity> {
    return this.getRepo(repo)
      .createQueryBuilder(`${DatabaseAliasEnum.WORKFORCE_RATE}`, manager?.queryRunner)
      .leftJoinAndSelect(`${DatabaseAliasEnum.WORKFORCE_RATE}.entity`, `${DatabaseAliasEnum.ENTITIES}`)
      .leftJoinAndSelect(`${DatabaseAliasEnum.WORKFORCE_RATE}.workUnit`, `${DatabaseAliasEnum.WORK_UNIT}`)
      .leftJoinAndSelect(`${DatabaseAliasEnum.WORKFORCE_RATE}.sectionCode`, `${DatabaseAliasEnum.SECTION_CODE}`)
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<WorkforceRateEntity>,
    filter?: WorkforceRateFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<WorkforceRateEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return WorkforceRateService.ColumnQueryNames.get(columnName);
  }
}
