import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
    Brackets,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { LoginEntity } from '../../../entities/psql/LoginEntity';
import { Employee } from '../../../entities/psql/EmployeeEntity';
import { AbstractRepositoryService } from '../../../libs/services/abstract.repository.service';
import { TOKENS_NAMES } from '../../../types/tokens.const';
import { dump, gen } from '../../../utils/utils';
import { TokenService } from '../../token/service/token.service';
import { LoginUpdateArgInput } from '../dto/args/login.update.arg.intput';
import { LOGIN_PROVIDERS_NAMES } from '../dto/provider/login.providers';
import { LoginCreateArgInput } from '../dto/args/login.create.arg.intput';
import { LoginFilterArgInput } from '../dto/args/login.filter.arg.input';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { LoginPaginationResultInterface } from '../dto/interfaces/login.pagination.result.interface';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { LoginRemoveArgInput } from '../dto/args/login.remove.arg.input';
import { PERMISSIONS_TYPES } from 'src/types/permissions.const';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { LoginPermissionsFormFilterArgInput } from '../dto/args/login.permissions.form.filter.arg.input';
import { PermissionEntity } from '../../../entities/psql/PermissionEntity';
import { LoginPermissionEntity } from '../../../entities/psql/LoginPermissionEntity';
import { LoginSavePermissionArgInput } from '../dto/args/login.save.permissions.arg.input';
import { LoginPermissionService } from '../../login-permission/service/login-permission.service';
import { LoginLogger } from '../logger/login.logger';
import { EmployeeService } from '../../employee/service/employee.service';
import { CopyPermissionsFromOtherLoginArgInput } from '../dto/args/copy.permissions.from.other.login.arg.input';

/**
 * Service Login
 */
@Injectable()
export class LoginService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'l.id'],
        ['active', 'l.active'],
        ['email', 'l.email'],
        ['username', 'l.username'],
        ['password', 'l.password'],
        ['confirmedAt', 'l.confirmedAt'],
        ['lastLogin', 'l.lastLogin'],
        ['emailPro', 'e.emailPro'],
        ['firstname', 'e.firstname'],
        ['lastname', 'e.lastname'],
        ['createdAt', 'l.createdAt'],
        ['updatedAt', 'l.updatedAt'],
        ['deletedAt', 'l.deletedAt'],
        ['createdBy', 'l.createdBy'],
        ['updatedBy', 'l.updatedBy'],
        ['permLogin', 'ps.login'],
    ]);

    /**
     * The constructor
     * @param _defaultLoginRepository
     * @param _tokenService
     * @param _loginPermissionService
     * @param _employeeService
     * @param _logger
     */
    public constructor(
        @Inject(LOGIN_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultLoginRepository: Repository<LoginEntity>,
        private readonly _tokenService: TokenService,
        private readonly _loginPermissionService: LoginPermissionService,
        private readonly _logger: LoginLogger,
        @Inject(forwardRef(() => EmployeeService))
        private readonly _employeeService: EmployeeService,
    ) {
        super();
    }

    public async getAllLoginByIds(ids: number[]): Promise<LoginEntity[]> {
        const data = await this._defaultLoginRepository.find({
            where: { id: In(ids) },
        });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
    }

    /**
     * Check if user by his id
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     * @returns
     */
    public async exist(
        id: number | LoginEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof LoginEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
    }

    /**
     * Check if Login user exist by his column value
     * @param column
     * @param value
     * @param id
     * @param withDeleted
     * @param repo
     * @param manager
     */
    public async existByColumn(
        value: any,
        column: string,
        id?: number | LoginEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof LoginEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('l', manager?.queryRunner)
                .leftJoin('l.employee', 'e');

            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (LoginEntity.isCryptColumn(column)) {
                qb.andWhereCrypt(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else if (LoginEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, {
                    column_value: value,
                });
            }

            if (id > 0 && column !== 'id')
                qb.andWhere(`${this._cn('id')} != :column_id`, {
                    column_id: id,
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
        filter?: LoginFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginEntity[]> {
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
    public async findLoginsAndPaginationAll(
        filter: LoginFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginPaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return on user by his ID
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async findOne(
        id: number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginEntity> {
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
    ): Promise<LoginEntity> {
        return new Promise(async (resolve, reject) => {
            const qb = this._initSelect(repo, manager, true);

            if (LoginEntity.isCryptColumn(column)) {
                qb.andWhereCrypt(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else if (LoginEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, {
                    column_value: value,
                });
            }

            resolve(await qb.getOne());
        });
    }

    /**
     * Validate the user if exist
     * @param username
     * @param repo
     * @param manager
     * @returns
     */
    public fetchLoginUser(
        username: string,
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<LoginEntity> {
        return this.getRepo(repo)
            .createQueryBuilder('l', manager?.queryRunner)
            .select('l.id')
            .addSelect('l.email')
            .addSelect('l.username')
            .addSelect('l.password')
            .andWhere('l.active = true')
            .leftJoin('l.employee', 'e')
            .andWhereCrypt(
                '(e.emailPro ILIKE :username OR l.username ILIKE :username OR l.email ILIKE :username)',
                {
                    username: username,
                },
            );
    }

    /**
     * Return all user permissions
     * @param user
     * @param repo
     * @param manager
     * @returns
     */
    public async findPermissions(
        user?: UserPayloadInterface,
        repo?: string,
        manager?: EntityManager,
    ): Promise<PERMISSIONS_TYPES[]> {
        return new Promise(async (resolve, reject) => {
            const response: PERMISSIONS_TYPES[] = [];

            const result = await this.getRepo(repo)
                .createQueryBuilder('l', manager?.queryRunner)
                .select('p.name', 'permission')
                .leftJoin('l.permissions', 'ps', 'ps.active = true')
                .leftJoin('ps.permission', 'p', 'p.active = true')
                .andWhere('l.id = :id', { id: user?.sub })
                .getRawMany();

            for (const i in result) {
                const value = result[i];

                // Add permissions
                if (!response.includes(value.permission))
                    response.push(value.permission);
            }

            resolve(response);
        });
    }

    /**
     * Return permissions for form
     * @param filter
     * @param repo
     * @param manager
     * @returns
     */
    public async findFormPermissions(
        filter: LoginPermissionsFormFilterArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const enabledCond =
                '(p.id = lp.permission AND l.id = :loginId AND e.id = :entityId)';

            const joinParameters: any = {};
            let joinCondition = 'lp.permission = p.id';

            if (filter.loginId) {
                joinCondition += ' AND lp.login = :loginId';
                joinParameters.loginId = filter.loginId;
            }

            if (filter.entityId) {
                joinCondition += ' AND lp.entity = :entityId';
                joinParameters.entityId = filter.entityId;
            }

            const qb = this.getRepo(repo)
                .manager.createQueryBuilder(manager?.queryRunner)
                .select('p.id', 'id')
                .addSelect('p.name', 'name')
                .addSelect('(lp.id IS NOT NULL)', 'enabled')
                .from(PermissionEntity, 'p')
                .leftJoin(
                    LoginPermissionEntity,
                    'lp',
                    joinCondition,
                    joinParameters,
                )
                .andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`p.name::text ILIKE '%read'`);
                        _qb.orWhere(`p.name::text ILIKE '%create'`);
                        _qb.orWhere(`p.name::text ILIKE '%update'`);
                        _qb.orWhere(`p.name::text ILIKE '%soft_delete'`);
                    }),
                );

            const result = await qb.getRawMany();
            const response = [];
            const userIsDefined = !!filter.loginId && !!filter.entityId;

            for (const i in result) {
                const item = result[i];

                let matched = item.name.match(
                    /(read|create|update|soft\_delete|delete)$/i,
                );
                if (matched) {
                    matched = matched[0];
                    const label = item.name.replace(`_${matched}`, '');
                    const found = response.find((p: any) => p.label === label);

                    if (found) {
                        found.grants[matched.toLowerCase()] = {
                            id: item.id,
                            enabled: item.enabled && userIsDefined,
                        };
                    } else {
                        response.push({
                            label: label,
                            grants: {
                                [matched.toLowerCase()]: {
                                    id: item.id,
                                    enabled: item.enabled && userIsDefined,
                                },
                            },
                        });
                    }
                }
            }

            resolve(response);
        });
    }

    /**
     * Return the user for action logs
     * @param user
     * @param repo
     * @param manager
     * @returns
     */
    public async findUserForActionLog(
        user: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginEntity> {
        if (user) {
            return this.getRepo(repo)
                .createQueryBuilder('l', manager?.queryRunner)
                .leftJoinAndSelect('l.employee', 'e')
                .andWhere('l.id = :id', { id: user.id })
                .getOne();
        }
        return;
    }

    /**
     * Find a user by his token value
     * @param token
     * @param repo
     * @param manager
     * @returns
     */
    public findUserByTokenValue(
        token: string,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginEntity> {
        const qb = this._initSelect(repo, manager);

        qb.andWhere('t.value = :token', { token: token });

        return qb.getOne();
    }

    /**
     * Save the login permissions
     * @param data
     * @returns
     */
    public async savePermissions(
        data: LoginSavePermissionArgInput,
    ): Promise<LoginEntity> {
        return new Promise(async (resolve, reject) => {
            const { loginId, entityId, permissionsIds } = data;

            // Remove and select unexist permission
            const unExistsPermissions =
                await this._loginPermissionService.removeAndGetUnExistingPermission(
                    loginId.id,
                    entityId.id,
                    permissionsIds.map((p) => p.id),
                );

            if (unExistsPermissions.length) {
                await this._loginPermissionService.createMultiple({
                    login: loginId,
                    entity: entityId,
                    active: true,
                    permissions: unExistsPermissions,
                });
            }

            const found = await this.findOne(loginId.id);

            resolve(found);
        });
    }

    /**
     * Save new Login User
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: LoginCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginEntity> {
        return this.useTransaction(async (transaction) => {
            const login = new LoginEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(login, rest);

            const result = await transaction.save(login);

            if (result) {
                if (rest.employee) {
                    await this._employeeService.update(
                        {
                            id: result.employee.id,
                            login: LoginEntity.init(result.id),
                        },
                        null,
                        transaction,
                    );
                }

                this._logger.create(login);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update Login
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: LoginUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginEntity> {
        return this.useTransaction(async (transaction) => {
            const { id, ...rest } = data;

            const loginFound = await this.findOne(id, repo, transaction);

            if (loginFound) {
                // Set old data
                this._logger.setOldData(loginFound);

                // Add new Data
                Object.assign(loginFound, rest);

                if (!loginFound.password) delete loginFound.password;

                if (rest.employee) {
                    await this._employeeService.update(
                        {
                            id: rest.employee.id,
                            login: loginFound,
                        },
                        null,
                        transaction,
                    );
                }

                // Save data
                const result = await transaction.save(loginFound);

                // Return saved login
                if (result) {
                    this._logger.update(loginFound);

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
        req: LoginRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof LoginEntity ? id.id : id;
                const login = await this.findOne(id, repo, transaction);

                if (login instanceof LoginEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(LoginEntity, login.id);

                        this._logger.delete(login);
                    } else {
                        await transaction.softDelete(LoginEntity, login.id);

                        this._logger.softDelete(login);
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
     * Add token for reset password
     * @param login
     * @param repo
     * @param manager
     * @returns
     */
    public async addResetPasswordToken(
        login: LoginEntity | number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<LoginEntity> {
        return this.useTransaction(async (transaction) => {
            if (typeof login === 'number')
                login = await this.findOne(login, repo, transaction);

            if (login?.id) {
                let lastValidToken = login.findValidToken(
                    TOKENS_NAMES.RESET_PASSWORD,
                );

                if (!lastValidToken) {
                    lastValidToken = await this._tokenService.save(
                        TOKENS_NAMES.RESET_PASSWORD,
                        gen(8, true, false, true, false),
                        '3d',
                        undefined,
                        transaction,
                    );

                    if (!login.tokens) login.tokens = [];

                    login.tokens = [...login.tokens, lastValidToken];

                    const result = await transaction.save(
                        new LoginEntity({
                            id: login.id,
                            tokens: login.tokens,
                        }),
                    );
                }

                return login;
            } else {
                return null;
            }
        }, manager || repo);
    }

    /**
     *
     * @param data
     * @param repo
     * @param manager
     */
    public async copyPermissionsFromOtherLogin(
        data: CopyPermissionsFromOtherLoginArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<any> {
        return this.useTransaction(async (transaction) => {
            const result =
                await this._loginPermissionService.copyPermissionsFromOtherLogin(
                    data.fromLogin,
                    data.toLogin,
                    null,
                    transaction,
                );

            if (result) {
                if (!data.targetEntity) return { success: true };

                return this.findFormPermissions(
                    {
                        loginId: data.toLogin,
                        entityId: data.targetEntity,
                    },
                    repo,
                    transaction,
                );
            }
        }, manager || repo);
    }

    /**
     * Return current repo
     * @param repo
     * @returns
     */
    public getRepo(repo?: string): Repository<LoginEntity> {
        return this._defaultLoginRepository;
    }

    /**
     * Apply user filter
     * @param qb
     * @param filter
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<Employee>,
        filter?: LoginFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhereCrypt(
                            `${this._cn('username')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );

                        _qb.orWhereCrypt(
                            `${this._cn('firstname')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );

                        _qb.orWhereCrypt(
                            `${this._cn('lastname')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );

                        _qb.orWhereCrypt(
                            `${this._cn('emailPro')} ILIKE :search`,
                            { search: filter.search },
                            'LIKE',
                        );
                    }),
                );
            }

            if (filter.username)
                qb.andWhereCrypt(
                    `${this._cn('username')} ILIKE :username`,
                    { username: filter.username },
                    'LIKE',
                );

            if (filter.firstname)
                qb.andWhereCrypt(
                    `${this._cn('firstname')} ILIKE :firstname`,
                    { firstname: filter.firstname },
                    'LIKE',
                );

            if (filter.lastname)
                qb.andWhereCrypt(
                    `${this._cn('lastname')} ILIKE :lastname`,
                    { lastname: filter.lastname },
                    'LIKE',
                );

            if (filter.emailPro)
                qb.andWhereCrypt(
                    `${this._cn('emailPro')} ILIKE :emailPro`,
                    { emailPro: filter.emailPro },
                    'LIKE',
                );

            if (filter.notIds?.length)
                qb.andWhere(`${this._cn('id')} NOT IN (:...notIds)`, {
                    notIds: filter.notIds,
                });

            if (filter.hasPermissions)
                qb.andWhere(`${this._cn('permLogin')} IS NOT NULL`);
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return LoginService.ColumnQueryNames.get(columnName);
    }

    /**
     * Init Select Query Builder
     * @param repo
     * @param manager
     * @param extractAll
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
        extractAll = false,
    ): SelectQueryBuilder<LoginEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('l', manager?.queryRunner)
            .leftJoinAndSelect('l.employee', 'e')
            .leftJoinAndSelect('e.picture', 'pic')
            .leftJoinAndSelect('l.tokens', 't')
            .leftJoin('l.permissions', 'ps');

        if (extractAll) {
            qb.leftJoinAndSelect('ps.permission', 'p')
                .leftJoinAndSelect('l.notifications', 'nl')
                .leftJoinAndSelect('nl.notification', 'n');
        }

        return qb;
    }
}
