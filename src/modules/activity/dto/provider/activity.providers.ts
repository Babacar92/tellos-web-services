import { Provider } from "@nestjs/common";
import { ActivityEntity } from "src/entities/psql/ActivityEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum ACTIVITY_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'ACTIVITY_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const ACTIVITY_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: ACTIVITY_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ActivityEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];