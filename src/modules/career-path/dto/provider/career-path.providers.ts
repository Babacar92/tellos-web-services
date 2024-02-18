import { Provider } from "@nestjs/common";
import { CareerPathEntity } from "src/entities/psql/CareerPathEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CAREER_PATH_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CAREER_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CAREER_PATH_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CAREER_PATH_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CareerPathEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];