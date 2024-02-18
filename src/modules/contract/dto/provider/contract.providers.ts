import { Provider } from "@nestjs/common";
import { ContractEntity } from "src/entities/psql/ContractEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CONTRACT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CONTRACT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CONTRACT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CONTRACT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ContractEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];