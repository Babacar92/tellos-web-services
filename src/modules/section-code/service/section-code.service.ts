import { Inject, Injectable } from '@nestjs/common';
import { SectionCodeEntity } from 'src/entities/psql/SectionCodeEntity';
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
import { SectionCodeCreateArgInput } from '../dto/args/section-code.create.arg.input';
import { SectionCodeFilterArgInput } from '../dto/args/section-code.filter.arg.input';
import { SectionCodeRemoveArgInput } from '../dto/args/section-code.remove.arg.input';
import { SectionCodeUpdateArgInput } from '../dto/args/section-code.update.arg.input';
import { SectionCodePaginationResultInterface } from '../dto/interfaces/section-code.pagination.result.interface';
import { SECTION_CODE_PROVIDERS_NAMES } from '../dto/provider/section-code.providers';
import { PurchaseAccountService } from 'src/modules/purchase-account/service/purchase-account.service';
import { PurchaseAccountEntity } from 'src/entities/psql/PurchaseAccountEntity';
import { SectionCodeLogger } from '../logger/section-code.logger';
import { SectionCodeFilterForWorkforceRateArgInput } from '../dto/args/section-code.filter.for.workforce.rate.arg.input';
import * as dotenv from "dotenv";
import { resolve } from 'path';
dotenv.config();

@Injectable()
export class SectionCodeService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'sc.id'],
    ['code', 'sc.code'],
    ['designation', 'sc.designation'],
    ['inventoryChangeAccount', 'sc.inventoryChangeAccount'],
    ['expensePostId', 'exp.id'],
    ['expensePost', 'exp.id'],
    ['expensePostField', 'sc.expensePost'],
    ['expensePost.name', 'exp.name'],
    ['active', 'sc.active'],
    ['createdAt', 'sc.createdAt'],
    ['updatedAt', 'sc.updatedAt'],
    ['deletedAt', 'sc.deletedAt'],
    ['createdBy', 'sc.createdBy'],
    ['updatedBy', 'sc.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   * @param _purchaseAccountService
   */
  public constructor(
    @Inject(SECTION_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<SectionCodeEntity>,
    private readonly _logger: SectionCodeLogger,
    private readonly _purchaseAccountService: PurchaseAccountService,
  ) {
    super();
  }

  /**
   * Check if Section Code Exist
   * @param id
   * @param withDeleted
   * @param repo
   * @param manager
   * @returns
   */
  public async exist(
    id?: number | SectionCodeEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof SectionCodeEntity) id = id.id;

    return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
  }

    /**
   * Check if Section Code is available for workforce rate
   * @param id
   * @param withDeleted
   * @param repo
   * @param manager
   * @returns
   */
    public async isAvailableForWorkforceRate(
      id?: number | SectionCodeEntity,
      withDeleted?: boolean,
      repo?: string,
      manager?: EntityManager,
    ): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        if (id instanceof SectionCodeEntity) id = id.id;
        
        const result = await this.getRepo(repo)
          .createQueryBuilder('sc', manager?.queryRunner)
          .select(`${this._cn('id')}`, 'id')
          .leftJoinAndSelect('sc.expensePost', 'exp')
          .andWhere(`${this._cn('id')} = :id`, { id: id})     
          .andWhere(`${this._cn('expensePostId')} = :expId`, { expId: process.env.ACCEPTED_EXPENSE_POST_FOR_WORKFORCE_RATE})
          .getRawOne();

        resolve(!!result?.id)
      })
    }

  /**
   * Found Section Code by column search and is value
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
    id?: number | SectionCodeEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof SectionCodeEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'sc',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (SectionCodeEntity.isColumnString(column)) {
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
   * Check if section code exists by his code or designation
   * @param code
   * @param designation
   * @param withDeleted
   * @param repo
   * @param manager
   */
  public async existByCodeAndDesignation(
    code: string,
    designation: string,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const qb = this.getRepo(repo).createQueryBuilder(
        'sc',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`)
        .andWhere(`${this._cn('code')} ILIKE :code`, { code: code })
        .andWhere(`${this._cn('designation')} ILIKE :designation`, {
          designation: designation,
        });

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
    filter?: SectionCodeFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<SectionCodeEntity[]> {
    const qb = this._initSelect(repo, manager);

    await this._applyFilter(qb, filter, sort);

    return qb.getMany();
  }

  /**
   * Return all quick access
   * @param filter
   * @param sort
   * @param repo
   * @param manager
   * @returns
   */
    public async findAllSectionCodesForWorkforceRate(
      filter: SectionCodeFilterForWorkforceRateArgInput,
      sort: DatabaseSortArg,
      pagination: PaginationArg,
      repo?: string,
      manager?: EntityManager,
    ): Promise<SectionCodePaginationResultInterface> {
      const qb = this.getRepo(repo)
        .createQueryBuilder('sc', manager?.queryRunner)
        .leftJoinAndSelect('sc.expensePost', 'exp')
        .leftJoinAndSelect('sc.workforceRates', 'wfr')
        .leftJoinAndSelect('wfr.workUnit', 'wu')
        .leftJoinAndSelect('wfr.entity', 'ent');
  
      qb.andWhere(`${this._cn('expensePostId')} = :id`, { id: process.env.ACCEPTED_EXPENSE_POST_FOR_WORKFORCE_RATE});

      if (filter) {
        if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });
  
        if (filter.ids?.length)
          qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });
  
        if (filter.search) {
          qb.andWhere(
            new Brackets((_qb) => {
              _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, {
                search: `%${filter.search}%`,
              });
              _qb.orWhere(`(${this._cn('designation')} ILIKE :search)`, {
                search: `%${filter.search}%`,
              });
            }),
          );
        }
  
        if (filter.code)
          qb.andWhere(`${this._cn('code')} ILIKE :code`, {
            code: `%${filter.code}%`,
          });
  
        if (filter.codes?.length)
          qb.andWhere(`${this._cn('code')} IN (:...codes)`, {
            codes: filter.codes,
          });
  
        if (filter.designation)
          qb.andWhere(`${this._cn('designation')} ILIKE :designation`, {
            designation: `%${filter.designation}%`,
          });
  
        if (filter.designations?.length)
          qb.andWhere(`${this._cn('designation')} IN (:...designations)`, {
            designations: filter.designations,
          });
      }

      qb.sortResult(sort, (columnName) => this._cn(columnName));
  
      return qb.getManyAndPaginate(pagination).then(result => {
        return {
          result: result.result.map(item => {
            return {
              ...item,
              workforceRates: item.workforceRates.filter(wf => wf.entity.id == filter.entity)
            }
          }),
          pagination: result.pagination
        }
      });
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
  public async findSectionCodeAndPaginationAll(
    filter: SectionCodeFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<SectionCodePaginationResultInterface> {
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
    id: number | SectionCodeEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<SectionCodeEntity> {
    if (id instanceof SectionCodeEntity) id = id.id;
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
  ): Promise<SectionCodeEntity> {
    const qb = this._initSelect(repo, manager);

    if (SectionCodeEntity.isColumnString(column)) {
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
   * Create new Section Code
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async create(
    data: SectionCodeCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<SectionCodeEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Section Code
      const newSectionCode = new SectionCodeEntity();

      // Get uploaded file
      const { purchaseAccounts, ...rest } = data;

      // Set Data
      Object.assign(newSectionCode, rest);

      if (purchaseAccounts?.length) {
        newSectionCode.purchaseAccounts = [];
        for (const i in purchaseAccounts) {
          const type = purchaseAccounts[i];
          newSectionCode.purchaseAccounts.push(
            await this._purchaseAccountService.savePurchaseAccount(type),
          );
        }
      }
      // Save hit
      const result = await transaction.save(newSectionCode);

      if (result) {
        this._logger.create(newSectionCode);

        return this.findOne(result.id, repo, transaction);
      }
    }, manager || repo);
  }

  /**
   * Update new Section Code
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async update(
    data: SectionCodeUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<SectionCodeEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, purchaseAccounts, ...req } = data;

      // Find existing
      const oldSectionCode = await this.findOne(id, repo, transaction);

      if (oldSectionCode) {
        // Set old data
        this._logger.setOldData(oldSectionCode);

        if (purchaseAccounts?.length) {
          const valuesToDelete: PurchaseAccountEntity[] =
            oldSectionCode.purchaseAccounts?.filter(
              (pa) => !purchaseAccounts.includes(pa.account),
            ) || [];

          const valuesToAdd = purchaseAccounts.filter(
            (value) =>
              !oldSectionCode.purchaseAccounts?.find(
                (pa) => pa.account === value,
              ),
          );

          if (valuesToDelete.length) {
            for (const i in valuesToDelete) {
              await this._purchaseAccountService.remove({
                id: valuesToDelete[i],
                type: REMOVE_TYPES.HARD,
              });
            }
          }

          if (valuesToAdd.length) {
            const purchaseAccounts: PurchaseAccountEntity[] = [
              ...oldSectionCode.purchaseAccounts,
            ];
            for (const i in valuesToAdd) {
              const type = valuesToAdd[i];
              purchaseAccounts.push(
                await this._purchaseAccountService.savePurchaseAccount(type),
              );
            }
            oldSectionCode.purchaseAccounts = purchaseAccounts;
          }
        }

        // Add new Data
        Object.assign(oldSectionCode, req);
        // Save Data
        const result = await transaction.save(oldSectionCode);

        if (result) {
          this._logger.update(oldSectionCode);

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
    req: SectionCodeRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof SectionCodeEntity ? id.id : id;
        const SectionCode = await this.findOne(id, repo, transaction);

        if (SectionCode instanceof SectionCodeEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(SectionCodeEntity, SectionCode.id);

            this._logger.delete(SectionCode);
          } else {
            await transaction.softDelete(SectionCodeEntity, SectionCode.id);

            this._logger.softDelete(SectionCode);
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
   * Remove expense post from section code
   * @param id
   * @param repo
   * @param manager
   * @returns
   */
  public async removeExpensePost(
    id: number,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      await this.update(
        {
          id: id,
          expensePost: null,
        },
        repo,
        transaction,
      );

      return true;
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
  ): SelectQueryBuilder<SectionCodeEntity> {
    return this.getRepo(repo)
      .createQueryBuilder('sc', manager?.queryRunner)
      .leftJoinAndSelect('sc.expensePost', 'exp')
      .leftJoinAndSelect('sc.purchaseAccounts', 'p');
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<SectionCodeEntity>,
    filter?: SectionCodeFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhere(`(${this._cn('code')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });

            _qb.orWhere(`(${this._cn('designation')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });
          }),
        );
      }

      if (filter.expensePostId)
        qb.andWhere(`${this._cn('expensePostId')} = :expensePostId`, {
          expensePostId: filter.expensePostId,
        });

      if (filter.expensePostIds?.length)
        qb.andWhere(`${this._cn('expensePostIds')} IN (:...expensePostIds)`, {
          expensePostIds: filter.expensePostIds,
        });

      if (filter.code)
        qb.andWhere(`${this._cn('code')} ILIKE :code`, {
          code: `%${filter.code}%`,
        });

      if (filter.codes?.length)
        qb.andWhere(`${this._cn('code')} IN (:...codes)`, {
          codes: filter.codes,
        });

      if (filter.designation)
        qb.andWhere(`${this._cn('designation')} ILIKE :designation`, {
          designation: `%${filter.designation}%`,
        });

      if (filter.designations?.length)
        qb.andWhere(`${this._cn('designation')} IN (:...designations)`, {
          designations: filter.designations,
        });

      if (filter.notIds?.length)
        qb.andWhere(`${this._cn('id')} NOT IN (:...notIds)`, {
          notIds: filter.notIds,
        });

      if (filter.hasNotExpensePost)
        qb.andWhere(`${this._cn('expensePostField')} IS NULL`);
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<SectionCodeEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return SectionCodeService.ColumnQueryNames.get(columnName);
  }

  /**
   * Verify if the section code is link to the given expense post ids
   * @param sectionCode
   * @param expensePostIds
   * @param withDeleted
   * @param repo
   * @param manager
   * @returns
   */
  public async linkToExpensePost(
    sectionCode: number,
    expensePostIds: number[],
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!sectionCode) {
        resolve(false);
        return;
      }

      const qb = this.getRepo(repo).createQueryBuilder(
        'sc',
        manager?.queryRunner,
      );

      qb.select(`COUNT(${this._cn('id')}) AS total`);
      qb.andWhere(`${this._cn('id')} = :id`, { id: sectionCode });
      qb.andWhere(`sc.expensePost IN (:...column_value)`, {
        column_value: expensePostIds,
      });

      const { total } = await qb.getRawOne();

      resolve(parseInt(total) > 0);
    });
  }
}
