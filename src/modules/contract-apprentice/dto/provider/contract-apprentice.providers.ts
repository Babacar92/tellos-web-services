import { Provider } from "@nestjs/common";
import { ContractApprenticeEntity } from "src/entities/psql/ContractApprenticeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CONTRACT_APPRENTICE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CONTRACT_APPRENTICE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CONTRACT_APPRENTICE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CONTRACT_APPRENTICE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ContractApprenticeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];