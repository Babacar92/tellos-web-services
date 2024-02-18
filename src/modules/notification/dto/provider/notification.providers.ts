import { Provider } from "@nestjs/common";
import { NotificationEntity } from "src/entities/psql/NotificationEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum NOTIFICATION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'NOTIFICATION_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const NOTIFICATION_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: NOTIFICATION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(NotificationEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];