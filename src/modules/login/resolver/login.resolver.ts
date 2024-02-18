import { MailerService } from '@nestjs-modules/mailer';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { ActionLog } from 'src/entities/mongodb/ActionLogSchema';
import { LoginEntity } from 'src/entities/psql/LoginEntity';
import { AllowPublic } from 'src/libs/auth/decorators/allow.public.decorator';
import { CurrentUser } from 'src/libs/auth/decorators/user.resolver.decorators';
import { UserLoginArg } from 'src/libs/auth/dto/args/user.login.arg';
import { UserConnectedResponseInterface } from 'src/libs/auth/dto/interfaces/user.connected.response.interface';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { AuthUserService } from 'src/libs/auth/services/auth.user.service';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { ResultPaginationInterface } from 'src/libs/databases/dto/interfaces/result.pagination.interface';
import { TranslationService } from 'src/libs/translation/service/translation.service';
import { TOKENS_NAMES } from 'src/types/tokens.const';
import { ActionLogFilterArg } from 'src/modules/action-log/dto/args/action-log.filter.arg';
import { ActionLogService } from 'src/modules/action-log/services/action-log.service';
import { LoginService } from '../service/login.service';
import { LoginResetPasswordArgInput } from '../dto/args/login.reset.password.arg.input';
import { LoginFilterArgInput } from '../dto/args/login.filter.arg.input';
import { LoginPaginationResultInterface } from '../dto/interfaces/login.pagination.result.interface';
import { LoginUpdateArgInput } from '../dto/args/login.update.arg.intput';
import { LoginRemoveArgInput } from '../dto/args/login.remove.arg.input';
import { LoginCreateArgInput } from '../dto/args/login.create.arg.intput';
import { LoginUserPermissionGuard } from '../guards/login.user.permission.guard';
import { LoginPermissionsFormFilterArgInput } from '../dto/args/login.permissions.form.filter.arg.input';
import { LoginSavePermissionArgInput } from '../dto/args/login.save.permissions.arg.input';
import { LoginLogger } from '../logger/login.logger';
import { LoginPermissionEntity } from '../../../entities/psql/LoginPermissionEntity';
import { CopyPermissionsFromOtherLoginArgInput } from '../dto/args/copy.permissions.from.other.login.arg.input';
import { Employee } from '@/entities/psql/EmployeeEntity';
import Dataloader from 'dataloader';

@UseGuards(LoginUserPermissionGuard)
@Resolver((of) => LoginEntity)
export class LoginResolver {
    /**
     * The constructor
     * @param _service
     * @param _authService
     * @param _actionLogService
     * @param _translationService
     * @param _mailerService
     * @param _logger
     */
    public constructor(
        private readonly _service: LoginService,
        private readonly _authService: AuthUserService,
        private readonly _actionLogService: ActionLogService,
        private readonly _translationService: TranslationService,
        private readonly _mailerService: MailerService,
        private readonly _logger: LoginLogger,
    ) {}

    /**
     * Set login of user
     * @param login
     * @returns
     */
    @AllowPublic()
    @Query(() => LoginEntity, {
        name: 'loginUser',
    })
    public async login(
        @Args('login')
        login: UserLoginArg,
    ): Promise<UserConnectedResponseInterface> {
        const connected = await this._authService.loginUser(
            login,
            (username) => {
                return this._service.fetchLoginUser(username);
            },
        );

        // If user not exist
        if (!connected) {
            throw new UnauthorizedException('Email or password invalid');
        }

        this._service
            .fetchLoginUser(login.username)
            .getOne()
            .then((user: LoginEntity) => {
                this._logger.login(user);

                return user;
            });

        return connected;
    }

    /**
     * Send email to user
     * @param email
     * @returns
     */
    @AllowPublic()
    @Query(() => LoginEntity, {
        name: 'recoverPasswordUser',
    })
    public async recoverPassword(
        @Args('email')
        email: string,
    ): Promise<{ sent: boolean; error?: string }> {
        return new Promise(async (resolve, reject) => {
            const userFound = await this._service.findByColumn(
                'emailPro',
                email,
            );

            if (userFound) {
                const result = await this._service.addResetPasswordToken(
                    userFound,
                );

                this._mailerService
                    .sendMail({
                        to: email,
                        subject: this._translationService
                            .trans('Récupération du mot de passe')
                            .getValue(),
                        template: './user/recover-password.hbs',
                        context: {
                            token: userFound.findValidToken(
                                TOKENS_NAMES.RESET_PASSWORD,
                            ).value,
                        },
                    })
                    .then((res) => {
                        this._logger.recoverPassword(userFound);

                        resolve({
                            sent: true,
                        });
                    })
                    .catch((err) => {
                        resolve({
                            sent: false,
                            error: err.message,
                        });
                    });
            } else {
                resolve({
                    sent: false,
                    error: "Email doesn't exist",
                });
            }
        });
    }

    /**
     * Return Logged user
     */
    @Query(() => LoginEntity, {
        name: 'findLogged',
    })
    public async findLogged(
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LoginEntity> {
        return this._service.findOne(user.sub);
    }

    /**
     * Return permissions for form front
     * @param filter
     * @param user
     */
    @Query(() => LoginEntity, {
        name: 'findFormPermissions',
    })
    public async findFormPermissions(
        @Args('filter')
        filter: LoginPermissionsFormFilterArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<any> {
        return this._service.findFormPermissions(filter);
    }

    /**
     * Return all logs
     * @returns
     */
    @Query(() => ActionLog, {
        name: 'getUsersLogs',
    })
    public async getLogs(
        @Args('filter')
        filter: ActionLogFilterArg,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
    ): Promise<{ result: ActionLog[]; pagination: ResultPaginationInterface }> {
        filter.LoginEntity = LoginEntity.name;

        const users: { [userId: number]: LoginEntity } = {};

        return this._actionLogService.findAll(
            filter,
            sort,
            pagination,
            async (a) => {
                a.user =
                    users[a.user?.id] ||
                    (await this._service.findUserForActionLog(a.user));

                if (a.user?.id && !users[a.user.id]) users[a.user.id] = a.user;
            },
        );
    }

    /**
     * Return all quick access with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param user
     * @returns
     */
    @Query(() => LoginEntity, {
        name: 'findAllLogins',
    })
    public async findAllLogins(
        @Args('filter')
        filter: LoginFilterArgInput,
        @Args('sort')
        sort: DatabaseSortArg,
        @Args('pagination')
        pagination: PaginationArg,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LoginPaginationResultInterface> {
        return this._service.findLoginsAndPaginationAll(
            filter,
            sort,
            pagination,
        );
    }

    /**
     * Return One Quick Access
     * @param id
     * @returns
     */
    @Query(() => LoginEntity, {
        name: 'findOneLogin',
    })
    public async findOne(
        @Args('id')
        id: number,
    ): Promise<LoginEntity> {
        return this._service.findOne(id);
    }

    /**
     * Save login permissions
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => LoginEntity, {
        name: 'saveLoginPermissions',
    })
    public async savePermissions(
        @Args('data')
        data: LoginSavePermissionArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LoginEntity> {
        return this._service.savePermissions(data);
    }

    /**
     * Create new Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => LoginEntity, {
        name: 'createLogin',
    })
    public async create(
        @Args('data')
        data: LoginCreateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LoginEntity> {
        return this._service.create(data);
    }

    /**
     * Update an existing Quick Access
     * @param data
     * @param user
     * @returns
     */
    @Mutation(() => LoginEntity, {
        name: 'updateLogin',
    })
    public async update(
        @Args('data')
        data: LoginUpdateArgInput,
        @CurrentUser()
        user: UserPayloadInterface,
    ): Promise<LoginEntity> {
        return this._service.update(data);
    }

    /**
     * Remove an Existing Quick Access
     * @param data
     * @returns
     */
    @Mutation(() => LoginEntity, {
        name: 'removeLogin',
    })
    public async remove(
        @Args('data')
        data: LoginRemoveArgInput,
    ): Promise<boolean> {
        return this._service.remove(data);
    }

    /**
     * Reset the user password if is valid
     * @param request
     * @returns
     */
    @AllowPublic()
    @Mutation(() => LoginEntity, {
        name: 'resetPasswordUser',
    })
    public async resetPassword(
        @Args('request')
        request: LoginResetPasswordArgInput,
    ): Promise<{ success: boolean; error?: string }> {
        return new Promise(async (resolve, reject) => {
            const userFound = await this._service.findUserByTokenValue(
                request.token,
            );

            if (userFound) {
                const result = await this._service.update({
                    id: userFound.id,
                    password: request.password,
                });

                this._logger.resetPassword(userFound);

                resolve({
                    success: true,
                });
            } else {
                resolve({
                    success: true,
                    error: 'User not found',
                });
            }
        });
    }

    /**
     * Copy all permission from user
     * @returns
     * @param data
     */
    @Mutation(() => LoginPermissionEntity, {
        name: 'copyPermissionsFromOtherLogin',
    })
    public async copyPermissionsFromOtherLogin(
        @Args('data')
        data: CopyPermissionsFromOtherLoginArgInput,
    ): Promise<boolean> {
        return this._service.copyPermissionsFromOtherLogin(data);
    }

    @ResolveField('employee', (returns) => Employee)
    public async employee(
        @Parent() parent: LoginEntity,
        @Context('employeeLoader') employeeLoader: Dataloader<number, Employee>,
    ): Promise<Employee> {
        employeeLoader.load(parent.employee_id);
        return employeeLoader.load(parent.employee_id);
    }
}
