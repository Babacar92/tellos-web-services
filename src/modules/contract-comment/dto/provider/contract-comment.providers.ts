import { Provider } from "@nestjs/common";
import { ContractCommentEntity } from "src/entities/psql/ContractCommentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CONTRACT_COMMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CONTRACT_COMMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CONTRACT_COMMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CONTRACT_COMMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ContractCommentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];