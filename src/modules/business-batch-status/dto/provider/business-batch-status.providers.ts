import { Provider } from "@nestjs/common";
import { BusinessBatchStatusEntity } from "src/entities/psql/BusinessBatchStatusEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_BATCH_STATUS_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_BATCH_STATUS_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_BATCH_STATUS_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_BATCH_STATUS_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessBatchStatusEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];