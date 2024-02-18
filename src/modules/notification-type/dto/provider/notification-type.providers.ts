import { Provider } from "@nestjs/common";
import { NotificationTypeEntity } from "src/entities/psql/NotificationTypeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum NOTIFICATION_TYPE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'NOTIFICATION_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const NOTIFICATION_TYPE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: NOTIFICATION_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(NotificationTypeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];