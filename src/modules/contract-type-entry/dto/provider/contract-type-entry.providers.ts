import { Provider } from "@nestjs/common";
import { ContractTypeEntryEntity } from "src/entities/psql/ContractTypeEntryEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CONTRACT_TYPE_ENTRY_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CONTRACT_TYPE_ENTRY_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CONTRACT_TYPE_ENTRY_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CONTRACT_TYPE_ENTRY_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ContractTypeEntryEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];