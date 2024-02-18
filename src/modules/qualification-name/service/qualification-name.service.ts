import { Inject, Injectable } from '@nestjs/common';
import { QualificationNameEntity } from 'src/entities/psql/QualificationNameEntity';
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
import { QualificationNameCreateArgInput } from '../dto/args/qualification-name.create.arg.input';
import { QualificationNameFilterArgInput } from '../dto/args/qualification-name.filter.arg.input';
import { QualificationNameRemoveArgInput } from '../dto/args/qualification-name.remove.arg.input';
import { QualificationNameUpdateArgInput } from '../dto/args/qualification-name.update.arg.input';
import { QualificationNamePaginationResultInterface } from '../dto/interfaces/qualification-name.pagination.result.interface';
import { QUALIFICATION_NAME_PROVIDERS_NAMES } from '../dto/provider/qualification-name.providers';
import { QualificationNameLogger } from '../logger/qualification-name.logger';

@Injectable()
export class QualificationNameService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'qn.id'],
    ['type', 'qt.id'],
    ['name', 'qn.name'],
    ['validity', 'qn.validity'],
    ['active', 'qn.active'],
    ['createdAt', 'qn.createdAt'],
    ['updatedAt', 'qn.updatedAt'],
    ['deletedAt', 'qn.deletedAt'],
    ['createdBy', 'qn.createdBy'],
    ['updatedBy', 'qn.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   */
  public constructor(
    @Inject(QUALIFICATION_NAME_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<QualificationNameEntity>,
    private readonly _logger: QualificationNameLogger,
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
    id?: number | QualificationNameEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof QualificationNameEntity) id = id.id;

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
    id?: number | QualificationNameEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof QualificationNameEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'qn',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (QualificationNameEntity.isColumnString(column)) {
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
    filter?: QualificationNameFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationNameEntity[]> {
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
  public async findQualificationNamesAndPaginationAll(
    filter: QualificationNameFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationNamePaginationResultInterface> {
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
    id: number | QualificationNameEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationNameEntity> {
    if (id instanceof QualificationNameEntity) id = id.id;
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
  ): Promise<QualificationNameEntity> {
    const qb = this._initSelect(repo, manager);

    if (QualificationNameEntity.isColumnString(column)) {
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
    data: QualificationNameCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationNameEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const qualificationName = new QualificationNameEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(qualificationName, rest);

      // Save hit
      const result = await transaction.save(qualificationName);

      if (result) {
        this._logger.create(qualificationName);

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
    data: QualificationNameUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<QualificationNameEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldQualificationName = await this.findOne(id, repo, transaction);

      if (oldQualificationName) {
        // Set old data
        this._logger.setOldData(oldQualificationName);

        // Add new Data
        Object.assign(oldQualificationName, req);

        // Save Data
        const result = await transaction.save(oldQualificationName);

        if (result) {
          this._logger.update(oldQualificationName);

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
    req: QualificationNameRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof QualificationNameEntity ? id.id : id;
        const qualificationName = await this.findOne(id, repo, transaction);

        if (qualificationName instanceof QualificationNameEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(
              QualificationNameEntity,
              qualificationName.id,
            );

            this._logger.delete(qualificationName);
          } else {
            await transaction.softDelete(
              QualificationNameEntity,
              qualificationName.id,
            );

            this._logger.softDelete(qualificationName);
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
  ): SelectQueryBuilder<QualificationNameEntity> {
    const qb = this.getRepo(repo)
      .createQueryBuilder('qn', manager?.queryRunner)
      .leftJoinAndSelect('qn.qualifications', 'q')
      .leftJoinAndSelect('qn.type', 'qt');

    return qb;
  }

  /**
   * Apply user filter
   * @param qb
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<QualificationNameEntity>,
    filter?: QualificationNameFilterArgInput,
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

            if (filter.search.match(/^[0-9]+((\.|,)[0-9]+)?$/)) {
              _qb.orWhere(`(${this._cn('validity')} = :search)`, {
                search: filter.search,
              });
            }
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

      if (filter.validity)
        qb.andWhere(`${this._cn('validity')} = :validity`, {
          validity: filter.validity,
        });

      if (filter.validities?.length)
        qb.andWhere(`${this._cn('validity')} IN (:...validities)`, {
          validities: filter.validities,
        });

      if (filter.type)
        qb.andWhere(`${this._cn('type')} = :type`, {
          type: filter.type,
        });

      if (filter.types?.length)
        qb.andWhere(`${this._cn('type')} IN (:...types)`, {
          types: filter.types,
        });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<QualificationNameEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return QualificationNameService.ColumnQueryNames.get(columnName);
  }
}
