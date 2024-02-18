import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EquipmentRateEntity } from 'src/entities/psql/EquipmentRateEntity';
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
import { EquipmentRateCreateArgInput } from '../dto/args/equipment-rate.create.arg.input';
import { EquipmentRateFilterArgInput } from '../dto/args/equipment-rate.filter.arg.input';
import { EquipmentRateRemoveArgInput } from '../dto/args/equipment-rate.remove.arg.input';
import { EquipmentRateUpdateArgInput } from '../dto/args/equipment-rate.update.arg.input';
import { EquipmentRatePaginationResultInterface } from '../dto/interfaces/equipment-rate.pagination.result.interface';
import { EQUIPMENT_RATE_PROVIDERS_NAMES } from '../dto/provider/equipment-rate.providers';
import { EquipmentRateLogger } from '../logger/equipment-rate.logger';
import { SectionCodeService } from 'src/modules/section-code/service/section-code.service';

enum DatabaseAliasEnum {
  EQUIPMENT_RATE = 'er',
  ENTITIES = 'ent',
  WORK_UNIT = 'wu',
  CATEGORY_EQUIPMENT = 'ce'
}

@Injectable()
export class EquipmentRateService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', `${DatabaseAliasEnum.EQUIPMENT_RATE}.id`],
    ['price', `${DatabaseAliasEnum.EQUIPMENT_RATE}.price`],
    ['active', `${DatabaseAliasEnum.EQUIPMENT_RATE}.active`],
    ['entity', `${DatabaseAliasEnum.ENTITIES}.id`],
    ['workUnit', `${DatabaseAliasEnum.WORK_UNIT}.id`],
    ['categoryEquipment', `${DatabaseAliasEnum.CATEGORY_EQUIPMENT}.id`],
    ['createdAt', `${DatabaseAliasEnum.EQUIPMENT_RATE}.createdAt`],
    ['updatedAt', `${DatabaseAliasEnum.EQUIPMENT_RATE}.updatedAt`],
    ['deletedAt', `${DatabaseAliasEnum.EQUIPMENT_RATE}.deletedAt`],
    ['createdBy', `${DatabaseAliasEnum.EQUIPMENT_RATE}.createdBy`],
    ['updatedBy', `${DatabaseAliasEnum.EQUIPMENT_RATE}.updatedBy`],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   */
  public constructor(
    @Inject(EQUIPMENT_RATE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<EquipmentRateEntity>,
    private readonly _logger: EquipmentRateLogger
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
    id?: number | EquipmentRateEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof EquipmentRateEntity) id = id.id;

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
    id?: number | EquipmentRateEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof EquipmentRateEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        `${DatabaseAliasEnum.EQUIPMENT_RATE}`,
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (EquipmentRateEntity.isColumnString(column)) {
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
    filter?: EquipmentRateFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EquipmentRateEntity[]> {
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
  public async findEquipmentRatesAndPaginationAll(
    filter: EquipmentRateFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EquipmentRatePaginationResultInterface> {
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
    id: number | EquipmentRateEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EquipmentRateEntity> {
    if (id instanceof EquipmentRateEntity) id = id.id;
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
  ): Promise<EquipmentRateEntity> {
    const qb = this._initSelect(repo, manager);

    if (EquipmentRateEntity.isColumnString(column)) {
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
    data: EquipmentRateCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EquipmentRateEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const workUnit = new EquipmentRateEntity();

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
    data: EquipmentRateUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EquipmentRateEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldEquipmentRate = await this.findOne(id, repo, transaction);

      if (oldEquipmentRate) {
        // Set old data
        this._logger.update(oldEquipmentRate);

        // Add new Data
        Object.assign(oldEquipmentRate, req);

        // Save Data
        const result = await transaction.save(oldEquipmentRate);

        if (result) {
          this._logger.update(oldEquipmentRate);

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
    req: EquipmentRateRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof EquipmentRateEntity ? id.id : id;
        const workUnit = await this.findOne(id, repo, transaction);

        if (workUnit instanceof EquipmentRateEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(EquipmentRateEntity, workUnit.id);

            this._logger.delete(workUnit);
          } else {
            await transaction.softDelete(EquipmentRateEntity, workUnit.id);

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
  ): SelectQueryBuilder<EquipmentRateEntity> {
    return this.getRepo(repo)
      .createQueryBuilder(`${DatabaseAliasEnum.EQUIPMENT_RATE}`, manager?.queryRunner)
      .leftJoinAndSelect(`${DatabaseAliasEnum.EQUIPMENT_RATE}.entity`, `${DatabaseAliasEnum.ENTITIES}`)
      .leftJoinAndSelect(`${DatabaseAliasEnum.EQUIPMENT_RATE}.workUnit`, `${DatabaseAliasEnum.WORK_UNIT}`)
      .leftJoinAndSelect(`${DatabaseAliasEnum.EQUIPMENT_RATE}.categoryEquipment`, `${DatabaseAliasEnum.CATEGORY_EQUIPMENT}`)
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<EquipmentRateEntity>,
    filter?: EquipmentRateFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<EquipmentRateEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return EquipmentRateService.ColumnQueryNames.get(columnName);
  }
}
