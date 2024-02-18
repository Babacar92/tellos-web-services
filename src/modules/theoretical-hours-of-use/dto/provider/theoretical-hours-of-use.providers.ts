import { Provider } from "@nestjs/common";
import { TheoreticalHoursOfUseEntity } from "src/entities/psql/TheoreticalHoursOfUseEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum THEORETICAL_HOURS_OF_USE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'THEORETICAL_HOURS_OF_USE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const THEORETICAL_HOURS_OF_USE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: THEORETICAL_HOURS_OF_USE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TheoreticalHoursOfUseEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];