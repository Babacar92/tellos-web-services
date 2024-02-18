import { Provider } from "@nestjs/common";
import { GoodEntity } from "src/entities/psql/GoodEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum WORK_UNIT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'WORK_UNIT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const WORK_UNIT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: WORK_UNIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(GoodEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];