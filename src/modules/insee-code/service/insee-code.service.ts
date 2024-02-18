import { Inject, Injectable } from '@nestjs/common';
import { InseeCodeEntity } from 'src/entities/psql/InseeCodeEntity';
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
import { InseeCodeCreateArgInput } from '../dto/args/insee-code.create.arg.input';
import { InseeCodeFilterArgInput } from '../dto/args/insee-code.filter.arg.input';
import { InseeCodeRemoveArgInput } from '../dto/args/insee-code.remove.arg.input';
import { InseeCodeUpdateArgInput } from '../dto/args/insee-code.update.arg.input';
import { InseeCodePaginationResultInterface } from '../dto/interfaces/insee-code.pagination.result.interface';
import { INSEE_CODE_PROVIDERS_NAMES } from '../dto/provider/insee-code.providers';
import { InseeCodeLogger } from '../logger/insee-code.logger';

@Injectable()
export class InseeCodeService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'ic.id'],
    ['name', 'ic.name'],
    ['code', 'ic.code'],
    ['active', 'ic.active'],
    ['createdAt', 'ic.createdAt'],
    ['updatedAt', 'ic.updatedAt'],
    ['deletedAt', 'ic.deletedAt'],
    ['createdBy', 'ic.createdBy'],
    ['updatedBy', 'ic.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   */
  public constructor(
    @Inject(INSEE_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<InseeCodeEntity>,
    private readonly _logger: InseeCodeLogger,
  ) {
    super();
  }

  /**
   * Check if Insee Code Exist
   * @param id
   * @param withDeleted
   * @param repo
   * @param manager
   * @returns
   */
  public async exist(
    id?: number | InseeCodeEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof InseeCodeEntity) id = id.id;

    return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
  }

  /**
   * Found Insee Code by column search and is value
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
    id?: number | InseeCodeEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof InseeCodeEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'ic',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (InseeCodeEntity.isColumnString(column)) {
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
   * Return all Insee Code
   * @param filter
   * @param sort
   * @param repo
   * @param manager
   * @returns
   */
  public async findAll(
    filter?: InseeCodeFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<InseeCodeEntity[]> {
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
  public async findInseeCodesAndPaginationAll(
    filter: InseeCodeFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<InseeCodePaginationResultInterface> {
    const qb = this._initSelect(repo, manager);

    await this._applyFilter(qb, filter, sort);

    return qb.getManyAndPaginate(pagination);
  }

  /**
   * Return one Insee Code by his id
   * @param id
   * @param repo
   * @param manager
   * @returns
   */
  public async findOne(
    id: number | InseeCodeEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<InseeCodeEntity> {
    if (id instanceof InseeCodeEntity) id = id.id;
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
  ): Promise<InseeCodeEntity> {
    const qb = this._initSelect(repo, manager);

    if (InseeCodeEntity.isColumnString(column)) {
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
   * Create new Insee Code
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async create(
    data: InseeCodeCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<InseeCodeEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Insee Code
      const InseeCode = new InseeCodeEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(InseeCode, rest);

      // Save hit
      const result = await transaction.save(InseeCode);

      if (result) {
        this._logger.create(InseeCode);

        return this.findOne(result.id, repo, transaction);
      }
    }, manager || repo);
  }

  /**
   * Update new Insee Code
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async update(
    data: InseeCodeUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<InseeCodeEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldInseeCode = await this.findOne(id, repo, transaction);

      if (oldInseeCode) {
        // Set old data
        this._logger.update(oldInseeCode);

        // Add new Data
        Object.assign(oldInseeCode, req);

        // Save Data
        const result = await transaction.save(oldInseeCode);

        if (result) {
          this._logger.update(oldInseeCode);

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
    req: InseeCodeRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof InseeCodeEntity ? id.id : id;
        const InseeCode = await this.findOne(id, repo, transaction);

        if (InseeCode instanceof InseeCodeEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(InseeCodeEntity, InseeCode.id);

            this._logger.delete(InseeCode);
          } else {
            await transaction.softDelete(InseeCodeEntity, InseeCode.id);

            this._logger.softDelete(InseeCode);
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
  ): SelectQueryBuilder<InseeCodeEntity> {
    return this.getRepo(repo).createQueryBuilder('ic', manager?.queryRunner);
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<InseeCodeEntity>,
    filter?: InseeCodeFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhere(`(${this._cn('name')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('code')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
          }),
        );
      }

      if (filter.name)
        qb.andWhere(`${this._cn('name')} ILIKE :name`, {
          name: `%${filter.name}%`,
        });

      if (filter.names?.length)
        qb.andWhere(`${this._cn('name')} IN (:...names)`, {
          names: filter.names,
        });

      if (filter.code)
        qb.andWhere(`${this._cn('code')} ILIKE :code`, {
          code: `%${filter.code}%`,
        });

      if (filter.codes?.length)
        qb.andWhere(`${this._cn('code')} IN (:...codes)`, {
          codes: filter.codes,
        });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<InseeCodeEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return InseeCodeService.ColumnQueryNames.get(columnName);
  }
}
