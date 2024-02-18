import { Provider } from "@nestjs/common";
import { EntityEntity } from "src/entities/psql/EntityEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum ENTITY_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'ENTITY_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const ENTITY_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: ENTITY_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(EntityEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];