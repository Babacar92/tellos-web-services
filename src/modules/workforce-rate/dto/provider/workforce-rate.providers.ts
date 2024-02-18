import { Provider } from "@nestjs/common";
import { WorkforceRateEntity } from "src/entities/psql/WorkforceRateEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum WORKFORCE_RATE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'WORKFORCE_RATE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const WORKFORCE_RATE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: WORKFORCE_RATE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(WorkforceRateEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];