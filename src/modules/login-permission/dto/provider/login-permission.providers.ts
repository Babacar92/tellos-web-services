import { Provider } from "@nestjs/common";
import { LoginPermissionEntity } from "src/entities/psql/LoginPermissionEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum LOGIN_PERMISSION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'LOGIN_PERMISSION_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const LOGIN_PERMISSION_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: LOGIN_PERMISSION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LoginPermissionEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];