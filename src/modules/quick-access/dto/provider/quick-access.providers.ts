import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { QuickAccessEntity } from "../../../../entities/psql/QuickAccessEntity";

/**
 * User Providers Names
 */
export enum QUICK_ACCESS_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'QUICK_ACCESS_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const QUICK_ACCESS_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: QUICK_ACCESS_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(QuickAccessEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];