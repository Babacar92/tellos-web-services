import { Provider } from "@nestjs/common";
import { InseeCodeEntity } from "src/entities/psql/InseeCodeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum INSEE_CODE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'INSEE_CODE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const INSEE_CODE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: INSEE_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(InseeCodeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];