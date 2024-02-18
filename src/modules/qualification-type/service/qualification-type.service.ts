import { Inject, Injectable } from '@nestjs/common';
import { QualificationTypeEntity } from 'src/entities/psql/QualificationTypeEntity';
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
import { QualificationTypeCreateArgInput } from '../dto/args/qualification-type.create.arg.input';
import { QualificationTypeFilterArgInput } from '../dto/args/qualification-type.filter.arg.input';
import { QualificationTypeRemoveArgInput } from '../dto/args/qualification-type.remove.arg.input';
import { QualificationTypeUpdateArgInput } from '../dto/args/qualification-type.update.arg.input';
import { QualificationTypePaginationResultInterface } from '../dto/interfaces/qualification-type.pagination.result.interface';
import { QUALIFICATION_TYPE_PROVIDERS_NAMES } from '../dto/provider/qualification-type.providers';
import { QualificationTypeLogger } from '../logger/qualification-type.logger';

@Injectable()
export class QualificationTypeService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'qt.id'],
    ['name', 'qt.name'],
    ['active', 'qt.active'],
    ['createdAt', 'qt.createdAt'],
    ['updatedAt', 'qt.updatedAt'],
    ['deletedAt', 'qt.deletedAt'],
    ['createdBy', 'qt.createdBy'],
    ['updatedBy', 'qt.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   */
  public constructor(
    @Inject(QUALIFICATION_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<QualificationTypeEntity>,
    private readonly _logger: QualificationTypeLogger,
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
    id?: number | QualificationTypeEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof QualificationTypeEntity) id = id.id;

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
    id?: number | QualificationTypeEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof QualificationTypeEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'qt',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (QualificationTypeEntity.isColumnString(column)) {
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
   * @param repo
   * @returns
   */
  public async findAll(
    filter?: QualificationTypeFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationTypeEntity[]> {
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
  public async findQualificationTypesAndPaginationAll(
    filter: QualificationTypeFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationTypePaginationResultInterface> {
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
    id: number | QualificationTypeEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationTypeEntity> {
    if (id instanceof QualificationTypeEntity) id = id.id;
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
  ): Promise<QualificationTypeEntity> {
    const qb = this._initSelect(repo, manager);

    if (QualificationTypeEntity.isColumnString(column)) {
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
    data: QualificationTypeCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationTypeEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const qualificationType = new QualificationTypeEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(qualificationType, rest);

      // Save hit
      const result = await transaction.save(qualificationType);

      if (result) {
        this._logger.create(qualificationType);

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
    data: QualificationTypeUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationTypeEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldQualificationType = await this.findOne(id, repo, transaction);

      if (oldQualificationType) {
        // Set old data
        this._logger.setOldData(oldQualificationType);

        // Add new Data
        Object.assign(oldQualificationType, req);

        // Save Data
        const result = await transaction.save(oldQualificationType);

        if (result) {
          this._logger.update(oldQualificationType);

          return this.findOne(id, repo, transaction);
        }
      }
    }, manager || repo);
  }

  /**
   * Update an existing entity
   * @param updateEntity
   * @param repo
   * @returns
   */
  public async remove(
    req: QualificationTypeRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof QualificationTypeEntity ? id.id : id;
        const qualificationType = await this.findOne(id, repo, transaction);

        if (qualificationType instanceof QualificationTypeEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(
              QualificationTypeEntity,
              qualificationType.id,
            );

            this._logger.delete(qualificationType);
          } else {
            await transaction.softDelete(
              QualificationTypeEntity,
              qualificationType.id,
            );

            this._logger.softDelete(qualificationType);
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
   * @returns
   */
  private _initSelect(
    repo?: string,
    manager?: EntityManager,
  ): SelectQueryBuilder<QualificationTypeEntity> {
    const qb = this.getRepo(repo)
      .createQueryBuilder('qt', manager?.queryRunner)
      .leftJoinAndSelect('qt.qualifications', 'q')
      .leftJoinAndSelect('qt.names', 'qn');

    return qb;
  }

  /**
   * Apply user filter
   * @param qb
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<QualificationTypeEntity>,
    filter?: QualificationTypeFilterArgInput,
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
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<QualificationTypeEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return QualificationTypeService.ColumnQueryNames.get(columnName);
  }
}
