import { Provider } from "@nestjs/common";
import { ZoneEntity } from "src/entities/psql/ZoneEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum ZONE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'ZONE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const ZONE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: ZONE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ZoneEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];