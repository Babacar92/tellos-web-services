import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { PermissionEntity } from "src/entities/psql/PermissionEntity";

/**
 * User Providers Names
 */
export enum PERMISSION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'PERMISSION_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const PERMISSION_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: PERMISSION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PermissionEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];