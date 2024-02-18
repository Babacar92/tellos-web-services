import { Provider } from "@nestjs/common";
import { LeaveDistributionEntity } from "src/entities/psql/LeaveDistributionEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum LEAVE_DISTRIBUTION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'LEAVE_DISTRIBUTION_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const LEAVE_DISTRIBUTION_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: LEAVE_DISTRIBUTION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LeaveDistributionEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];