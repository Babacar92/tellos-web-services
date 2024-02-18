import { Inject, Injectable } from '@nestjs/common';
import { BusinessEntity } from 'src/entities/psql/BusinessEntity';
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
import { BusinessCreateArgInput } from '../dto/args/business.create.arg.input';
import { BusinessFilterArgInput } from '../dto/args/business.filter.arg.input';
import { BusinessRemoveArgInput } from '../dto/args/business.remove.arg.input';
import { BusinessUpdateArgInput } from '../dto/args/business.update.arg.input';
import { BusinessPaginationResultInterface } from '../dto/interfaces/business.pagination.result.interface';
import { BUSINESS_PROVIDERS_NAMES } from '../dto/provider/business.providers';
import { BusinessLogger } from '../logger/business.logger';

@Injectable()
export class BusinessService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'b.id'],
    ['customerId', 'cust.id'],
    ['customer.name', 'cust.name'],
    ['paymentModeId', 'pm.id'],
    ['paymentMode.title', 'pm.title'],
    ['paymentTypeId', 'pt.id'],
    ['paymentType.title', 'pt.title'],
    ['tenderTypeId', 'tt.id'],
    ['tenderType', 'tt.title'],
    ['tenderType.title', 'tt.title'],
    ['marketType', 'mt.title'],
    ['marketTypeId', 'mt.id'],
    ['marketType.title', 'mt.title'],
    ['worksChiefId', 'wc.id'],
    ['worksChief.title', 'wc.title'],
    ['worksManagerId', 'wm.id'],
    ['worksManager.title', 'wm.title'],
    ['mainSiteManagerId', 'msm.id'],
    ['mainSiteManager.title', 'msm.title'],
    ['siteManager2Id', 'sm2.id'],
    ['siteManager2.title', 'sm2.title'],
    ['siteManager3Id', 'sm3.id'],
    ['siteManager3.title', 'sm3.title'],
    ['commercialId', 'com.id'],
    ['commercial.title', 'com.title'],
    ['pictureId', 'pct.id'],
    ['picture.title', 'pct.title'],
    ['email', 'b.email'],
    ['code', 'b.code'],
    ['label', 'b.label'],
    ['type', 'b.type'],
    ['status', 'b.status'],
    ['externalCode', 'b.externalCode'],
    ['payingOwner', 'b.payingOwner'],
    ['mainOwner', 'b.mainOwner'],
    ['underCover', 'b.underCover'],
    ['owner', 'b.owner'],
    ['origin', 'b.origin'],
    ['estimatedAmount', 'b.estimatedAmount'],
    ['referenceCase', 'b.referenceCase'],
    ['bidBond', 'b.bidBond'],
    ['startDate', 'b.startDate'],
    ['endDate', 'b.endDate'],
    ['startDateStudy', 'b.startDateStudy'],
    ['endDateStudy', 'b.endDateStudy'],
    ['workDuration', 'b.workDuration'],
    ['unit', 'b.unit'],
    ['applicationDate', 'b.applicationDate'],
    ['retrieveDate', 'b.retrieveDate'],
    ['limiteDate', 'b.limiteDate'],
    ['depositDate', 'b.depositDate'],
    ['agency', 'b.agency'],
    ['address', 'b.address'],
    ['postalCode', 'b.postalCode'],
    ['city', 'b.city'],
    ['country', 'b.country'],
    ['phone', 'b.phone'],
    ['website', 'b.website'],
    ['gps', 'b.gps'],
    ['delegatedCustomer', 'b.delegatedCustomer'],
    ['economist', 'b.economist'],
    ['engineeringOffice', 'b.engineeringOffice'],
    ['fuildEngineeringOffice', 'b.fuildEngineeringOffice'],
    ['groundEngineeringOffice', 'b.groundEngineeringOffice'],
    ['controlOffice', 'b.controlOffice'],
    ['pilot', 'b.pilot'],
    ['safetyCoordinator', 'b.safetyCoordinator'],
    ['isEditable', 'b.isEditable'],
    ['active', 'b.active'],
    ['createdAt', 'b.createdAt'],
    ['updatedAt', 'b.updatedAt'],
    ['deletedAt', 'b.deletedAt'],
    ['createdBy', 'b.createdBy'],
    ['updatedBy', 'b.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   */
  public constructor(
    @Inject(BUSINESS_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<BusinessEntity>,
    private readonly _logger: BusinessLogger,
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
    id?: number | BusinessEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof BusinessEntity) id = id.id;

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
    id?: number | BusinessEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof BusinessEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'b',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (BusinessEntity.isColumnString(column)) {
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
    filter?: BusinessFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<BusinessEntity[]> {
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
  public async findBusinesssAndPaginationAll(
    filter: BusinessFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<BusinessPaginationResultInterface> {
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
    id: number | BusinessEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<BusinessEntity> {
    if (id instanceof BusinessEntity) id = id.id;
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
  ): Promise<BusinessEntity> {
    const qb = this._initSelect(repo, manager);

    if (BusinessEntity.isColumnString(column)) {
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
    data: BusinessCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<BusinessEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const business = new BusinessEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(business, rest);

      // Save hit
      const result = await transaction.save(business);

      if (result) {
        this._logger.create(business);

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
    data: BusinessUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<BusinessEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, abandon, ...req } = data;

      // Find existing
      const oldBusiness = await this.findOne(id, repo, transaction);

      if (oldBusiness) {
        // Set old data
        this._logger.setOldData(oldBusiness);

        // Add new Data
        Object.assign(oldBusiness, req);

        if (abandon && !oldBusiness.abandonedAt) {
          oldBusiness.abandonedAt = new Date();
        }

        // Save Data
        const result = await transaction.save(oldBusiness);

        if (result) {
          this._logger.update(oldBusiness);

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
    req: BusinessRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof BusinessEntity ? id.id : id;
        const business = await this.findOne(id, repo, transaction);

        if (business instanceof BusinessEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(BusinessEntity, business.id);

            this._logger.delete(business);
          } else {
            await transaction.softDelete(BusinessEntity, business.id);

            this._logger.softDelete(business);
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
  ): SelectQueryBuilder<BusinessEntity> {
    const qb = this.getRepo(repo)
      .createQueryBuilder('b', manager?.queryRunner)
      .leftJoinAndSelect('b.customer', 'cust')
      .leftJoinAndSelect('b.paymentMode', 'pm')
      .leftJoinAndSelect('b.paymentType', 'pt')
      .leftJoinAndSelect('b.tenderType', 'tt')
      .leftJoinAndSelect('b.marketType', 'mt')
      .leftJoinAndSelect('b.worksChief', 'wc')
      .leftJoinAndSelect('b.worksManager', 'wm')
      .leftJoinAndSelect('b.mainSiteManager', 'msm')
      .leftJoinAndSelect('b.siteManager2', 'sm2')
      .leftJoinAndSelect('b.siteManager3', 'sm3')
      .leftJoinAndSelect('b.commercial', 'com')
      .leftJoinAndSelect('b.picture', 'pct')
      .leftJoinAndSelect('b.batches', 'bat');
    return qb;
  }

  /**
   * Apply user filter
   * @param qb
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<BusinessEntity>,
    filter?: BusinessFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhere(`(${this._cn('unit')})::text ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`(${this._cn('type')})::text ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`(${this._cn('status')})::text ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('email')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('code')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('label')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('externalCode')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('payingOwner')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('mainOwner')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('owner')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('origin')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('referenceCase')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('agency')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('address')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('postalCode')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('city')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('country')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('phone')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('website')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('gps')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('delegatedCustomer')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('economist')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('engineeringOffice')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('fuildEngineeringOffice')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(
              `${this._cn('groundEngineeringOffice')} ILIKE :search`,
              { search: `%${filter.search}%` },
            );
            _qb.orWhere(`${this._cn('controlOffice')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('pilot')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('safetyCoordinator')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('createdBy')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('updatedBy')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('customer.name')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('paymentMode.title')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('paymentType.title')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('tenderType.title')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(`${this._cn('marketType.title')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
            _qb.orWhere(
              `(${this._cn('worksChief.title')})::text ILIKE :search`,
              { search: `%${filter.search}%` },
            );
            _qb.orWhere(
              `(${this._cn('worksManager.title')})::text ILIKE :search`,
              { search: `%${filter.search}%` },
            );
            _qb.orWhere(
              `(${this._cn('mainSiteManager.title')})::text ILIKE :search`,
              { search: `%${filter.search}%` },
            );
            _qb.orWhere(
              `(${this._cn('siteManager2.title')})::text ILIKE :search`,
              { search: `%${filter.search}%` },
            );
            _qb.orWhere(
              `(${this._cn('siteManager3.title')})::text ILIKE :search`,
              { search: `%${filter.search}%` },
            );
            _qb.orWhere(
              `(${this._cn('commercial.title')})::text ILIKE :search`,
              { search: `%${filter.search}%` },
            );
            _qb.orWhere(`${this._cn('picture.title')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
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

      if (filter.statuses?.length)
        qb.andWhere(`(${this._cn('status')})::text IN (:...statuses)`, {
          statuses: filter.statuses,
        });

      if (filter.types?.length)
        qb.andWhere(`(${this._cn('type')})::text IN (:...types)`, {
          types: filter.types,
        });

      if (filter.tenderTypes?.length)
        qb.andWhere(`${this._cn('tenderTypeId')} IN (:...tenderTypes)`, {
          tenderTypes: filter.tenderTypes,
        });

      if (filter.marketTypes?.length)
        qb.andWhere(`${this._cn('marketTypeId')} IN (:...marketTypes)`, {
          marketTypes: filter.marketTypes,
        });

      if (filter.dateLimiteFrom instanceof Date)
        qb.andWhere(`${this._cn('limiteDate')} >= :dateLimiteFrom`, {
          dateLimiteFrom: filter.dateLimiteFrom,
        });

      if (filter.dateLimiteTo instanceof Date)
        qb.andWhere(`${this._cn('limiteDate')} <= :dateLimiteTo`, {
          dateLimiteTo: filter.dateLimiteTo,
        });

      if (typeof filter.estimatedAmountFrom === 'number')
        qb.andWhere(`${this._cn('estimatedAmount')} >= :estimatedAmountFrom`, {
          estimatedAmountFrom: filter.estimatedAmountFrom,
        });

      if (typeof filter.estimatedAmountTo === 'number')
        qb.andWhere(`${this._cn('estimatedAmount')} <= :estimatedAmountTo`, {
          estimatedAmountTo: filter.estimatedAmountTo,
        });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<BusinessEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return BusinessService.ColumnQueryNames.get(columnName);
  }
}
