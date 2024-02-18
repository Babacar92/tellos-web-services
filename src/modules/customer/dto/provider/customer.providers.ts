import { Provider } from "@nestjs/common";
import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CUSTOMER_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CUSTOMER_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CUSTOMER_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CUSTOMER_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];