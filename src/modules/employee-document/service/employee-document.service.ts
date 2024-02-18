import { Inject, Injectable } from '@nestjs/common';
import { EmployeeDocumentEntity } from 'src/entities/psql/EmployeeDocumentEntity';
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
import { EmployeeDocumentCreateArgInput } from '../dto/args/employee-document.create.arg.input';
import { EmployeeDocumentFilterArgInput } from '../dto/args/employee-document.filter.arg.input';
import { EmployeeDocumentRemoveArgInput } from '../dto/args/employee-document.remove.arg.input';
import { EmployeeDocumentUpdateArgInput } from '../dto/args/employee-document.update.arg.input';
import { EmployeeDocumentPaginationResultInterface } from '../dto/interfaces/employee-document.pagination.result.interface';
import { EMPLOYEE_DOCUMENT_PROVIDERS_NAMES } from '../dto/provider/employee-document.providers';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { EMPLOYEE_DOCUMENT_STATUS } from '../dto/enums/employee-document.status.enum';
import { EmployeeDocumentSignedArgInput } from '../dto/args/employee-document.signed.arg.input';
import { EmployeeDocumentLogger } from '../logger/employee-document.logger';

@Injectable()
export class EmployeeDocumentService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'd.id'],
    ['validateDate', 'd.validateDate'],
    ['dunningDate', 'd.dunningDate'],
    ['status', 'd.status'],
    ['requireEmployeeSignature', 'd.requireEmployeeSignature'],
    ['requireEmployeeUpload', 'd.requireEmployeeUpload'],
    ['active', 'd.active'],
    ['employeeId', 'e.id'],
    ['type', 't.id'],
    ['typeId', 't.id'],
    ['typeTitle', 't.title'],
    ['file', 'f.id'],
    ['fileId', 'f.id'],
    ['fileName', 'f.name'],
    ['fileOriginalName', 'f.originalName'],
    ['createdAt', 'd.createdAt'],
    ['updatedAt', 'd.updatedAt'],
    ['deletedAt', 'd.deletedAt'],
    ['createdBy', 'd.createdBy'],
    ['updatedBy', 'd.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   * @param _logger
   * @param _uploadService
   */
  public constructor(
    @Inject(EMPLOYEE_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<EmployeeDocumentEntity>,
    private readonly _logger: EmployeeDocumentLogger,
    private readonly _uploadService: UploadService,
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
    id?: number | EmployeeDocumentEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof EmployeeDocumentEntity) id = id.id;

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
    id?: number | EmployeeDocumentEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof EmployeeDocumentEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'd',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (EmployeeDocumentEntity.isColumnString(column)) {
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
    filter?: EmployeeDocumentFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EmployeeDocumentEntity[]> {
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
  public async findEmployeeDocumentsAndPaginationAll(
    filter: EmployeeDocumentFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EmployeeDocumentPaginationResultInterface> {
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
    id: number | EmployeeDocumentEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EmployeeDocumentEntity> {
    if (id instanceof EmployeeDocumentEntity) id = id.id;
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
  ): Promise<EmployeeDocumentEntity> {
    const qb = this._initSelect(repo, manager);

    if (EmployeeDocumentEntity.isColumnString(column)) {
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
    data: EmployeeDocumentCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EmployeeDocumentEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const employeedocument = new EmployeeDocumentEntity();

      // Get uploaded file
      const { file, ...rest } = data;

      if (file) {
        employeedocument.file = await this._uploadService.saveFromGraphqlUpload(
          file,
          null,
          null,
          null,
          null,
          transaction,
        );

        if (data.requireEmployeeSignature) {
          employeedocument.status = EMPLOYEE_DOCUMENT_STATUS.WAITING_SIGNATURE;
        } else if (!data.requireEmployeeUpload) {
          employeedocument.status = EMPLOYEE_DOCUMENT_STATUS.ACCEPTED;
        }
      }

      if (data.requireEmployeeUpload) {
        employeedocument.status = EMPLOYEE_DOCUMENT_STATUS.WAITING_FILE;
      }

      // Set Data
      Object.assign(employeedocument, rest);

      // Save hit
      const result = await transaction.save(employeedocument);

      if (result) {
        this._logger.create(employeedocument);

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
    data: EmployeeDocumentUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<EmployeeDocumentEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, file, ...req } = data;

      // Find existing
      const oldEmployeeDocument = await this.findOne(id, repo, transaction);

      if (oldEmployeeDocument) {
        // Set old data
        this._logger.setOldData(oldEmployeeDocument);

        if (file) {
          oldEmployeeDocument.file =
            await this._uploadService.saveFromGraphqlUpload(
              file,
              null,
              null,
              oldEmployeeDocument.file,
              null,
              transaction,
            );

          oldEmployeeDocument.status = EMPLOYEE_DOCUMENT_STATUS.TRANSMITTED;
        }

        // Add new Data
        Object.assign(oldEmployeeDocument, req);

        // Save Data
        const result = await transaction.save(oldEmployeeDocument);

        if (result) {
          this._logger.update(oldEmployeeDocument);

          return this.findOne(id, repo, transaction);
        }
      }
    }, manager || repo);
  }

  /**
   * Set signed file if is signed
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async signEmployeeDocument(
    data: EmployeeDocumentSignedArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (data.signed && !data.file) {
        reject('Empty file');
        return true;
      }

      const updated = await this.update(
        {
          id: data.id,
          status: data.signed
            ? EMPLOYEE_DOCUMENT_STATUS.SIGNED
            : EMPLOYEE_DOCUMENT_STATUS.NOT_SIGNED,
          file: data.file,
          signedDate: data.signed ? new Date() : null,
        },
        repo,
        manager,
      );

      resolve(!!updated);
    });
  }

  /**
   * Accept file
   * @param id
   * @param repo
   * @param manager
   * @returns
   */
  public async acceptEmployeeDocument(
    id: number,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const updated = await this.update(
        {
          id: id,
          status: EMPLOYEE_DOCUMENT_STATUS.ACCEPTED,
          validateDate: new Date(),
        },
        repo,
        manager,
      );

      resolve(!!updated);
    });
  }

  /**
   * Refuse file
   * @param id
   * @param repo
   * @param manager
   * @returns
   */
  public async refuseEmployeeDocument(
    id: number,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const updated = await this.update(
        {
          id: id,
          status: EMPLOYEE_DOCUMENT_STATUS.REFUSED,
          validateDate: new Date(),
        },
        repo,
        manager,
      );

      resolve(!!updated);
    });
  }

  /**
   * Update an existing entity
   * @param req
   * @param repo
   * @param manager
   * @returns
   */
  public async remove(
    req: EmployeeDocumentRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof EmployeeDocumentEntity ? id.id : id;
        const employeedocument = await this.findOne(id, repo, transaction);

        if (employeedocument instanceof EmployeeDocumentEntity) {
          if (type === REMOVE_TYPES.HARD) {
            const result = await this._uploadService.remove(
              {
                id: employeedocument.file,
                type: type,
              },
              null,
              transaction,
            );

            await transaction.delete(
              EmployeeDocumentEntity,
              employeedocument.id,
            );

            this._logger.delete(employeedocument);
          } else {
            await transaction.softDelete(
              EmployeeDocumentEntity,
              employeedocument.id,
            );

            this._logger.softDelete(employeedocument);
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
  ): SelectQueryBuilder<EmployeeDocumentEntity> {
    const qb = this.getRepo(repo)
      .createQueryBuilder('d', manager?.queryRunner)
      .leftJoinAndSelect('d.type', 't')
      .leftJoinAndSelect('d.employee', 'e')
      .leftJoinAndSelect('d.file', 'f')
      .leftJoinAndSelect('t.category', 'c');

    return qb;
  }

  /**
   * Apply user filter
   * @param qb
   * @param filter
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<EmployeeDocumentEntity>,
    filter?: EmployeeDocumentFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.andWhere(`(${this._cn('status')})::text ILIKE :search`, {
              search: `%${filter.search}%`,
            });

            _qb.andWhere(`${this._cn('fileName')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });

            _qb.andWhere(`${this._cn('fileOriginalName')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });

            _qb.andWhere(`${this._cn('typeTitle')} ILIKE :search`, {
              search: `%${filter.search}%`,
            });
          }),
        );
      }

      if (typeof filter.requireSignature === 'boolean')
        qb.andWhere(
          `${this._cn('requireEmployeeSignature')} = :requireSignature`,
          { requireSignature: filter.requireSignature },
        );

      if (filter.employeeId)
        qb.andWhere(`${this._cn('employeeId')} = :employeeId`, {
          employeeId: filter.employeeId,
        });

      if (filter.status)
        qb.andWhere(`(${this._cn('status')})::text ILIKE :status`, {
          status: `%${filter.status}%`,
        });

      if (filter.statuses?.length)
        qb.andWhere(`(${this._cn('status')})::text IN (:...statuses)`, {
          statuses: filter.statuses,
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

  public getRepo(repo?: string): Repository<EmployeeDocumentEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return EmployeeDocumentService.ColumnQueryNames.get(columnName);
  }
}
