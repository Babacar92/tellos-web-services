import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { LoginEntity } from "../../../../entities/psql/LoginEntity";

/**
 * Login Providers Names
 */
export enum LOGIN_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'DEFAULT_LOGIN_REPOSITORY',
    ROLE_GUARD = 'LOGIN_USER_ROLE_GUARD',
    PERMISSION_GUARD = 'LOGIN_USER_PERMISSION_GUARD',
}

/**
 * Login Providers
 */
export const LOGIN_PROVIDERS = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: LOGIN_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LoginEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];