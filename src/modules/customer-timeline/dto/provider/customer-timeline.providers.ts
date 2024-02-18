import { Provider } from "@nestjs/common";
import { CustomerTimelineEntity } from "src/entities/psql/CustomerTimelineEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CUSTOMER_TIMELINE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CUSTOMER_TIMELINE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CUSTOMER_TIMELINE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CUSTOMER_TIMELINE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerTimelineEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];