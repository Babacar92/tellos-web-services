import { Inject, Injectable } from '@nestjs/common';
import { LoginPermissionEntity } from 'src/entities/psql/LoginPermissionEntity';
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
import { LoginPermissionCreateArgInput } from '../dto/args/login-permission.create.arg.input';
import { LoginPermissionFilterArgInput } from '../dto/args/login-permission.filter.arg.input';
import { LoginPermissionRemoveArgInput } from '../dto/args/login-permission.remove.arg.input';
import { LoginPermissionUpdateArgInput } from '../dto/args/login-permission.update.arg.input';
import { LoginPermissionPaginationResultInterface } from '../dto/interfaces/login-permission.pagination.result.interface';
import { LOGIN_PERMISSION_PROVIDERS_NAMES } from '../dto/provider/login-permission.providers';
import { LoginPermissionLogger } from '../logger/login-permission.logger';
import { dump } from '../../../utils/utils';

@Injectable()
export class LoginPermissionService extends AbstractRepositoryService {
  /**
   * The column name for search
   */
  public static ColumnQueryNames = new Map([
    ['id', 'lp.id'],
    ['login', 'l.id'],
    ['entity', 'e.id'],
    ['permission', 'p.id'],
    ['permissionName', 'p.name'],
    ['active', 'lp.active'],
    ['createdAt', 'lp.createdAt'],
    ['updatedAt', 'lp.updatedAt'],
    ['deletedAt', 'lp.deletedAt'],
    ['createdBy', 'lp.createdBy'],
    ['updatedBy', 'lp.updatedBy'],
  ]);

  /**
   * Constructor of User service
   * @param _defaultUserRepository
   */
  public constructor(
    @Inject(LOGIN_PERMISSION_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
    private readonly _defaultUserRepository: Repository<LoginPermissionEntity>,
    private readonly _logger: LoginPermissionLogger,
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
    id?: number | LoginPermissionEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    if (id instanceof LoginPermissionEntity) id = id.id;

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
    id?: number | LoginPermissionEntity,
    withDeleted?: boolean,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!value) {
        resolve(false);
        return;
      }

      if (id instanceof LoginPermissionEntity) id = id.id;

      const qb = this.getRepo(repo).createQueryBuilder(
        'lp',
        manager?.queryRunner,
      );

      // Add with deleted at
      if (withDeleted) qb.withDeleted();

      qb.select(`COUNT(${this._cn('id')}) AS total`);

      if (LoginPermissionEntity.isColumnString(column)) {
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
    filter?: LoginPermissionFilterArgInput,
    sort?: DatabaseSortArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<LoginPermissionEntity[]> {
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
  public async findLoginPermissionsAndPaginationAll(
    filter: LoginPermissionFilterArgInput,
    sort: DatabaseSortArg,
    pagination: PaginationArg,
    repo?: string,
    manager?: EntityManager,
  ): Promise<LoginPermissionPaginationResultInterface> {
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
    id: number | LoginPermissionEntity,
    repo?: string,
    manager?: EntityManager,
  ): Promise<LoginPermissionEntity> {
    if (id instanceof LoginPermissionEntity) id = id.id;
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
  ): Promise<LoginPermissionEntity> {
    const qb = this._initSelect(repo, manager);

    if (LoginPermissionEntity.isColumnString(column)) {
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
  public async createMultiple(
    data: LoginPermissionCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<LoginPermissionEntity[]> {
    return this.useTransaction(async (transaction) => {
      if (!data.permissions?.length) return null;

      // Get insert result
      const insertResult = await this.getRepo(repo)
        .createQueryBuilder(null, manager?.queryRunner)
        .insert()
        .into(LoginPermissionEntity)
        .values(
          data.permissions.map((p) => ({
            login: data.login,
            entity: data.entity,
            active: true,
            permission: p,
          })),
        )
        .execute();

      return this.findAll(
        {
          loginId: data.login.id,
          entityId: data.entity.id,
        },
        null,
        repo,
        transaction,
      );
    }, manager || repo);
  }

  /**
   * Create new Quick Access
   * @param data
   * @param repo
   * @param manager
   * @returns
   */
  public async create(
    data: LoginPermissionCreateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<LoginPermissionEntity> {
    return this.useTransaction(async (transaction) => {
      // Init new Entity Quick Access
      const LoginPermission = new LoginPermissionEntity();

      // Get uploaded file
      const { ...rest } = data;

      // Set Data
      Object.assign(LoginPermission, rest);

      // Save hit
      const result = await transaction.save(LoginPermission);

      if (result) {
        this._logger.create(LoginPermission);

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
    data: LoginPermissionUpdateArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<LoginPermissionEntity> {
    return this.useTransaction(async (transaction) => {
      // Extract ID
      const { id, ...req } = data;

      // Find existing
      const oldLoginPermission = await this.findOne(id, repo, transaction);

      if (oldLoginPermission) {
        // Set old data
        this._logger.setOldData(oldLoginPermission);

        // Add new Data
        Object.assign(oldLoginPermission, req);

        // Save Data
        const result = await transaction.save(oldLoginPermission);

        if (result) {
          this._logger.update(oldLoginPermission);

          return this.findOne(id, repo, transaction);
        }
      }
    }, manager || repo);
  }

  /**
   * Remove old permission
   * @param loginId
   * @param entityId
   * @param permissionsIds
   * @param repo
   * @param manager
   * @returns
   */
  public async removeAndGetUnExistingPermission(
    loginId: number,
    entityId: number,
    permissionsIds: number[],
    repo?: string,
    manager?: EntityManager,
  ): Promise<LoginPermissionEntity[]> {
    return new Promise(async (resolve, reject) => {
      if (permissionsIds?.length) {
        // Delete query builder result
        const removeResult = await this.getRepo(repo)
          .createQueryBuilder(null, manager?.queryRunner)
          .delete()
          .from(LoginPermissionEntity)
          .where('login = :loginId', { loginId: loginId || -1 })
          .andWhere('entity = :entityId', { entityId: entityId || -1 })
          .andWhere('permission NOT IN (:...permissionsIds)', {
            permissionsIds: permissionsIds,
          })
          .execute();

        // Select query builder result
        const selectResult: number[] = (
          await this.getRepo(repo)
            .createQueryBuilder('lp', manager?.queryRunner)
            .select('lp.permission', 'permission')
            .where('lp.login = :loginId', { loginId: loginId || -1 })
            .andWhere('lp.entity = :entityId', { entityId: entityId || -1 })
            .getRawMany()
        ).map((v: any) => v.permission);

        resolve(
          permissionsIds
            .filter((v) => !selectResult.includes(v))
            .map((v) => LoginPermissionEntity.init(v)),
        );
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Update an existing entity
   * @param updateEntity
   * @param repo
   * @returns
   */
  public async remove(
    req: LoginPermissionRemoveArgInput,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.useTransaction(async (transaction) => {
      if (req && req.id && req.type) {
        let { id, type } = req;

        id = id instanceof LoginPermissionEntity ? id.id : id;
        const LoginPermission = await this.findOne(id, repo, transaction);

        if (LoginPermission instanceof LoginPermissionEntity) {
          if (type === REMOVE_TYPES.HARD) {
            await transaction.delete(LoginPermissionEntity, LoginPermission.id);

            this._logger.delete(LoginPermission);
          } else {
            await transaction.softDelete(
              LoginPermissionEntity,
              LoginPermission.id,
            );

            this._logger.softDelete(LoginPermission);
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
   * Copy all permission of users
   * @param fromLogin
   * @param toLogin
   * @param repo
   * @param manager
   */
  public async copyPermissionsFromOtherLogin(
    fromLogin: number,
    toLogin: number,
    repo?: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      // Can't set with same login user
      if (fromLogin === toLogin) {
        resolve(false);
        return;
      }

      // Remove old permissions
      await this.getRepo(repo)
        .createQueryBuilder('lp', manager?.queryRunner)
        .delete()
        .where('login = :login', { login: toLogin })
        .execute();

      // Get all permissions of login from and set login to
      const fromLoginPermissions = (
        (await this.getRepo(repo)
          .createQueryBuilder('lp', manager?.queryRunner)
          .select('lp.entity', 'entity_id')
          .addSelect('lp.permission', 'permission_id')
          .leftJoin('lp.login', 'l')
          .andWhere('l.active = true')
          .andWhere('lp.login = :login', { login: fromLogin })
          .getRawMany()) || []
      ).map((item: any) => ({
        ...item,
        login_id: toLogin,
      }));

      if (fromLoginPermissions.length) {
        // Insert all permission from login from
        await this.getRepo(repo)
          .createQueryBuilder('lp', manager?.queryRunner)
          .insert()
          .into(LoginPermissionEntity, [
            'entity_id',
            'permission_id',
            'login_id',
          ])
          .values(fromLoginPermissions)
          .execute();
      }

      // Return value as true or false
      resolve(!!fromLoginPermissions.length);
    });
  }

  /**
   * Init Select Query Builder
   * @param repo
   * @returns
   */
  private _initSelect(
    repo?: string,
    manager?: EntityManager,
  ): SelectQueryBuilder<LoginPermissionEntity> {
    const qb = this.getRepo(repo)
      .createQueryBuilder('lp', manager?.queryRunner)
      .leftJoinAndSelect('lp.login', 'l')
      .leftJoinAndSelect('lp.entity', 'e')
      .leftJoinAndSelect('lp.permission', 'p');
    return qb;
  }

  /**
   * Apply user filter
   * @param qb
   * @param sort
   */
  private async _applyFilter(
    qb: SelectQueryBuilder<LoginPermissionEntity>,
    filter?: LoginPermissionFilterArgInput,
    sort?: DatabaseSortArg,
  ): Promise<void> {
    if (filter) {
      if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

      if (filter.ids?.length)
        qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

      if (filter.search) {
        qb.andWhere(
          new Brackets((_qb) => {
            _qb.orWhere(`(${this._cn('permissionName')} ILIKE :search)`, {
              search: `%${filter.search}%`,
            });
          }),
        );
      }

      if (filter.loginId)
        qb.andWhere(`${this._cn('login')} = :loginId`, {
          loginId: filter.loginId,
        });

      if (filter.entityId)
        qb.andWhere(`${this._cn('entity')} = :entityId`, {
          entityId: filter.entityId,
        });

      if (filter.permissionId)
        qb.andWhere(`${this._cn('permission')} = :permissionId`, {
          permissionId: filter.permissionId,
        });

      if (filter.permissionName)
        qb.andWhere(`${this._cn('permissionName')} ILIKE :permissionName`, {
          permissionName: `${filter.permissionName}%`,
        });
    }

    qb.sortResult(sort, (columnName) => this._cn(columnName));
  }

  public getRepo(repo?: string): Repository<LoginPermissionEntity> {
    return this._defaultUserRepository;
  }

  /**
   * Return the column name for query builder
   * @param columnName
   * @returns
   */
  private _cn(columnName?: string): string | undefined {
    return LoginPermissionService.ColumnQueryNames.get(columnName);
  }
}
