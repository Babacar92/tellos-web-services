import { Provider } from "@nestjs/common";
import { BusinessEntity } from "src/entities/psql/BusinessEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];