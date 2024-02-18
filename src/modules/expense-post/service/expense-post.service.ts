import { Inject, Injectable } from '@nestjs/common';
import { ExpensePostEntity } from 'src/entities/psql/ExpensePostEntity';
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
import { ExpensePostCreateArgInput } from '../dto/args/expense-post.create.arg.input';
import { ExpensePostFilterArgInput } from '../dto/args/expense-post.filter.arg.input';
import { ExpensePostRemoveArgInput } from '../dto/args/expense-post.remove.arg.input';
import { ExpensePostUpdateArgInput } from '../dto/args/expense-post.update.arg.input';
import { ExpensePostPaginationResultInterface } from '../dto/interfaces/expense-post.pagination.result.interface';
import { EXPENSE_POST_PROVIDERS_NAMES } from '../dto/provider/expense-post.providers';
import { SectionCodeService } from 'src/modules/section-code/service/section-code.service';
import { ExpensePostLogger } from '../logger/expense-post.logger';
import { SectionCodeIntoExpensePostArgInput } from '../dto/args/section.code.into.expense.post.arg.input';

@Injectable()
export class ExpensePostService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'ep.id'],
    ['name', 'ep.name'],
    ['active', 'ep.active'],
    ['createdAt', 'ep.createdAt'],
    ['updatedAt', 'ep.updatedAt'],
    ['deletedAt', 'ep.deletedAt'],
    ['createdBy', 'ep.createdBy'],
    ['updatedBy', 'ep.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   * @param _sectionCodeService
   */
  public constructor(
    @Inject(EXPENSE_POST_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<ExpensePostEntity>,
    private readonly _logger: ExpensePostLogger,
    private readonly _sectionCodeService: SectionCodeService,
  ) {
    super();
  }

  /**
   * Check if Employe Expense Post Exist
   * @param id
   * @param withDeleted
   * @param repo
   * @param manager
   * @returns
   */
  public async exist(
    id?: number | ExpensePostEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof ExpensePostEntity) id = id.id;

    return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
  }

  /**
   * Found ExpensePost by column search and is value
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
    id?: number | ExpensePostEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (id instanceof ExpensePostEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'ep',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (ExpensePostEntity.isColumnString(column)) {
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
   * Return all Expense Post
   * @param filter
   * @param sort
   * @param repo
   * @param manager
   * @returns
   */
  public async findAll(
    filter?: ExpensePostFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ExpensePostEntity[]> {
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
  public async findExpensePostAndPaginationAll(
    filter: ExpensePostFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ExpensePostPaginationResultInterface> {
    const qb = this._initSelect(repo, manager);

    await this._applyFilter(qb, filter, sort);

    return qb.getManyAndPaginate(pagination);
  }

  /**
   * Return one ExpensePost by his id
   * @param id
   * @param repo
   * @param manager
   * @returns
   */
  public async findOne(
    id: number | ExpensePostEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ExpensePostEntity> {
    if (id instanceof ExpensePostEntity) id = id.id;
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
  ): Promise<ExpensePostEntity> {
    const qb = this._initSelect(repo, manager);

    if (ExpensePostEntity.isColumnString(column)) {
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
   * Create new Expense Post
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async create(
    data: ExpensePostCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ExpensePostEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Employee Contract Type Entry
      const ExpensePost = new ExpensePostEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(ExpensePost, rest);

      // Save hit
      const result = await transaction.save(ExpensePost);

      if (result) {
        this._logger.create(ExpensePost);

        return this.findOne(result.id, repo, transaction);
      }
    }, manager || repo);
  }

  /**
   * Update new Expense Post
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async update(
    data: ExpensePostUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ExpensePostEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, sectionCodes, ...req } = data;

      // Find existing
      const oldExpensePost = await this.findOne(id, repo, transaction);

      if (oldExpensePost) {
        // Set old data
        this._logger.setOldData(oldExpensePost);

        // Add new Data
        Object.assign(oldExpensePost, req);

        // Fonctionne pas comme ça devrait
        // Remplacé par pa la méthode this.addSectionCodeIntoExpensePost
        // Appelé par le billet du resolver
        // if (sectionCodes?.length) {
        //   const oldSectionCodes = oldExpensePost.sectionCodes?.length
        //     ? oldExpensePost.sectionCodes
        //     : [];
        //
        //   oldExpensePost.sectionCodes = [...oldSectionCodes, ...sectionCodes];
        // }

        // Save Data
        const result = await transaction.save(oldExpensePost);

        if (result) {
          this._logger.update(oldExpensePost);

          return this.findOne(id, repo, transaction);
        }
      }
    }, manager || repo);
  }

  /**
   *
   * @param data
   * @param repo
   * @param manager
   */
  public async addSectionCodeIntoExpensePost(
    data: SectionCodeIntoExpensePostArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<ExpensePostEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract data
      const { expensePostId, sectionCodeId } = data;
      // Update section code
      await this._sectionCodeService.update(
        {
          id: sectionCodeId,
          expensePost: ExpensePostEntity.init(expensePostId),
        },
        null,
        transaction,
      );
      // Return the expense post
      return this.findOne(expensePostId, repo, transaction);
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
    req: ExpensePostRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        const { id, type } = req;

        const ExpensePost = await this.findOne(id, repo, transaction);

        if (ExpensePost instanceof ExpensePostEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(ExpensePostEntity, ExpensePost.id);

            this._logger.delete(ExpensePost);
          } else {
            await transaction.softDelete(ExpensePostEntity, ExpensePost.id);

            this._logger.softDelete(ExpensePost);
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
  ): SelectQueryBuilder<ExpensePostEntity> {
    return this.getRepo(repo)
      .createQueryBuilder('ep', manager?.queryRunner)
      .leftJoinAndSelect('ep.sectionCodes', 'sc')
      .leftJoinAndSelect('sc.purchaseAccounts', 'pa');
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<ExpensePostEntity>,
    filter?: ExpensePostFilterArgInput,
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
        qb.andWhere(`${this._cn('names')} IN (:...names)`, {
          names: filter.names,
        });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<ExpensePostEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return ExpensePostService.ColumnQueryNames.get(columnName);
  }
}
