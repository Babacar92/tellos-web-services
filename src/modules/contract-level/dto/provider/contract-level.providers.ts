import { Provider } from "@nestjs/common";
import { ContractLevelEntity } from "src/entities/psql/ContractLevelEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CONTRACT_LEVEL_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CONTRACT_LEVEL_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CONTRACT_LEVEL_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CONTRACT_LEVEL_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ContractLevelEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];