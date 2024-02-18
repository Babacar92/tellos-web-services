import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../datasource-config";
import { TokenEntity } from "../../../entities/psql/TokenEntity";

/**
 * Token Providers Names
 */
export enum TOKEN_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'DEFAULT_TOKEN_REPOSITORY',
}

/**
 * Token Providers
 */
export const TOKEN_PROVIDERS = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: TOKEN_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TokenEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];