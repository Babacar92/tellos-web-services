import { Provider } from "@nestjs/common";
import { RegulationCodeEntity } from "src/entities/psql/RegulationCodeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum REGULATION_CODE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'REGULATION_CODE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const REGULATION_CODE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: REGULATION_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(RegulationCodeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];