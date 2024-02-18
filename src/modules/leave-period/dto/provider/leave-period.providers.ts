import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { LeavePeriodEntity } from "src/entities/psql/LeavePeriodEntity";

/**
 * User Providers Names
 */
export enum LEAVE_PERIOD_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'LEAVE_PERIOD_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const LEAVE_PERIOD_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: LEAVE_PERIOD_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LeavePeriodEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];