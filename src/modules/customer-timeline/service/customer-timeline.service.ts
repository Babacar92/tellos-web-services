import { Inject, Injectable } from '@nestjs/common';
import { CustomerTimelineEntity } from 'src/entities/psql/CustomerTimelineEntity';
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
import { CustomerTimelineCreateArgInput } from '../dto/args/customer-timeline.create.arg.input';
import { CustomerTimelineFilterArgInput } from '../dto/args/customer-timeline.filter.arg.input';
import { CustomerTimelineRemoveArgInput } from '../dto/args/customer-timeline.remove.arg.input';
import { CustomerTimelineUpdateArgInput } from '../dto/args/customer-timeline.update.arg.input';
import { CustomerTimelinePaginationResultInterface } from '../dto/interfaces/customer-timeline.pagination.result.interface';
import { CUSTOMER_TIMELINE_PROVIDERS_NAMES } from '../dto/provider/customer-timeline.providers';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { dateToTimestamp } from '../../../utils/utils';
import { CustomerTimelineLogger } from '../logger/customer-timeline.logger';

@Injectable()
export class CustomerTimelineService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'ct.id'],
    ['login', 'l.id'],
    ['loginId', 'l.id'],
    ['employee', 'e.id'],
    ['employeeId', 'e.id'],
    ['customer', 'c.id'],
    ['customerId', 'c.id'],
    ['customer.name', 'c.name'],
    ['title', 'ct.title'],
    ['type', 'ct.type'],
    ['comment', 'ct.comment'],
    ['dateFrom', 'ct.dateFrom'],
    ['dateTo', 'ct.dateTo'],
    ['isTodo', 'ct.isTodo'],
    ['doneAt', 'ct.doneAt'],
    ['active', 'ct.active'],
    ['createdAt', 'ct.createdAt'],
    ['updatedAt', 'ct.updatedAt'],
    ['deletedAt', 'ct.deletedAt'],
    ['createdBy', 'ct.createdBy'],
    ['updatedBy', 'ct.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   */
  public constructor(
    @Inject(CUSTOMER_TIMELINE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<CustomerTimelineEntity>,
    private readonly _uploadService: UploadService,
    private readonly _logger: CustomerTimelineLogger,
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
    id?: number | CustomerTimelineEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof CustomerTimelineEntity) id = id.id;

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
    id?: number | CustomerTimelineEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof CustomerTimelineEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'ct',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (CustomerTimelineEntity.isColumnString(column)) {
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
    filter?: CustomerTimelineFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<CustomerTimelineEntity[]> {
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
  public async findCustomerTimelinesAndPaginationAll(
    filter: CustomerTimelineFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<CustomerTimelinePaginationResultInterface> {
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
    id: number | CustomerTimelineEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<CustomerTimelineEntity> {
    if (id instanceof CustomerTimelineEntity) id = id.id;
    return this.findByColumn('id', id, repo, manager);
  }

  public async countByType(
    customerId: number,
    repo?: string,
    manager?: EntityManager,
  ): Promise<{ [key: string]: number }> {
    return new Promise(async (resolve, reject) => {
      const qb = this.getRepo(repo).createQueryBuilder(
        'ct',
        manager?.queryRunner,
      );

      qb.select('ct.type', 'type')
        .leftJoin('ct.customer', 'cust')
        .andWhere('cust.id = :custId', { custId: customerId || -1 });

      qb.addSelect(
        (_qb) =>
          _qb
            .select('COUNT(ct2.id)', 'total')
            .from(CustomerTimelineEntity, 'ct2')
            .andWhere('ct2.type = ct.type'),
        'total',
      );

      const result = await qb.groupBy('ct.type').getRawMany();

      const returned: any = {
        total: 0,
      };

      for (const i in result) {
        const row = result[i];
        const total = parseInt(row.total);

        returned[row.type] = total;
        returned.total += total;
      }

      resolve(returned);
    });
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
  ): Promise<CustomerTimelineEntity> {
    const qb = this._initSelect(repo, manager);

    if (CustomerTimelineEntity.isColumnString(column)) {
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
    data: CustomerTimelineCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<CustomerTimelineEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const customerTimeline = new CustomerTimelineEntity();

      // Get uploaded file
      const { file, ...rest } = data;

      // Set Data
      Object.assign(customerTimeline, rest);

      if (file) {
        customerTimeline.file = await this._uploadService.saveFromGraphqlUpload(
          file,
          null,
          null,
          null,
          null,
          transaction,
        );
      }
      // Save hit
      const result = await transaction.save(customerTimeline);

      if (result) {
        this._logger.create(customerTimeline);

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
    data: CustomerTimelineUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<CustomerTimelineEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, file, done, ...req } = data;

      // Find existing
      const oldCustomerTimeline = await this.findOne(id, repo, transaction);

      if (oldCustomerTimeline) {
        // Set old data
        this._logger.setOldData(oldCustomerTimeline);

        // Add new Data
        Object.assign(oldCustomerTimeline, req);

        if (file) {
          oldCustomerTimeline.file =
            await this._uploadService.saveFromGraphqlUpload(
              file,
              null,
              null,
              oldCustomerTimeline.file,
              null,
              transaction,
            );
        }

        if (typeof done === 'boolean') {
          if (done) oldCustomerTimeline.doneAt = new Date();
          else oldCustomerTimeline.doneAt = null;
        }

        // Save Data
        const result = await transaction.save(oldCustomerTimeline);

        if (result) {
          this._logger.update(oldCustomerTimeline);

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
    req: CustomerTimelineRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof CustomerTimelineEntity ? id.id : id;
        const customerTimeline = await this.findOne(id, repo, transaction);

        if (customerTimeline instanceof CustomerTimelineEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(
              CustomerTimelineEntity,
              customerTimeline.id,
            );

            this._logger.delete(customerTimeline);
          } else {
            await transaction.softDelete(
              CustomerTimelineEntity,
              customerTimeline.id,
            );

            this._logger.softDelete(customerTimeline);
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
  ): SelectQueryBuilder<CustomerTimelineEntity> {
    const qb = this.getRepo(repo)
      .createQueryBuilder('ct', manager?.queryRunner)
      .leftJoinAndSelect('ct.customer', 'c')
      .leftJoinAndSelect('ct.login', 'l')
      .leftJoinAndSelect('l.employee', 'e')
      .leftJoinAndSelect('e.picture', 'pic')
      .leftJoinAndSelect('ct.file', 'f');

    return qb;
  }

  /**
   * Apply user filter
   * @param qb
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<CustomerTimelineEntity>,
    filter?: CustomerTimelineFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhereCrypt(
              `${this._cn('customer.name')} ILIKE :search`,
              { search: `%${filter.search}%` },
              'LIKE',
            );
            _qb.orWhereCrypt(
              `${this._cn('title')} ILIKE :search`,
              { search: `%${filter.search}%` },
              'LIKE',
            );
            _qb.orWhereCrypt(
              `${this._cn('comment')} ILIKE :search`,
              { search: `%${filter.search}%` },
              'LIKE',
            );
            _qb.orWhereCrypt(
              `${this._cn('type')}::text ILIKE :search`,
              { search: `%${filter.search}%` },
              'LIKE',
            );
          }),
        );
      }

      if (filter.customerId)
        qb.andWhere(`${this._cn('customerId')} = :customerId`, {
          customerId: filter.customerId,
        });

      if (filter.customerIds?.length)
        qb.andWhere(`${this._cn('customerId')} IN (:...customerIds)`, {
          customerIds: filter.customerIds,
        });

      if (filter.type)
        qb.andWhere(`${this._cn('type')}::text ILIKE :type`, {
          type: filter.type,
        });

      if (filter.types?.length)
        qb.andWhere(`${this._cn('type')}::text IN (:...types)`, {
          types: filter.types,
        });

      let dateFromTransormed: string, dateToTransormed: string;
      if (
        filter.dateFrom &&
        (dateFromTransormed = dateToTimestamp(filter.dateFrom, 'date'))
      ) {
        qb.andWhere(
          `to_char(${this._cn('createdAt')}, 'YYYY-MM-DD') >= :dateFrom`,
          { dateFrom: dateFromTransormed },
        );
      }

      if (
        filter.dateTo &&
        (dateToTransormed = dateToTimestamp(filter.dateTo, 'date'))
      ) {
        qb.andWhere(
          `to_char(${this._cn('createdAt')}, 'YYYY-MM-DD') <= :dateTo`,
          { dateTo: dateToTransormed },
        );
      }

      if (typeof filter.isTodo === 'boolean')
        qb.andWhere(`${this._cn('isTodo')} = :isTodo`, {
          isTodo: filter.isTodo,
        });

      if (typeof filter.done === 'boolean') {
        if (filter.done) qb.andWhere(`${this._cn('doneAt')} IS NOT NULL`);
        else qb.andWhere(`${this._cn('doneAt')} IS NULL`);
      }
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<CustomerTimelineEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return CustomerTimelineService.ColumnQueryNames.get(columnName);
  }
}
