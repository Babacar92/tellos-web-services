import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { ContractSectionEntity } from "src/entities/psql/ContractSectionEntity";
/**
 * User Providers Names
 */
export enum CONTRACT_SECTION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CONTRACT_SECTION_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CONTRACT_SECTION_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CONTRACT_SECTION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ContractSectionEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];