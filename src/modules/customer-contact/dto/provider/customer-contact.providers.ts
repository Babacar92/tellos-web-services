import { Provider } from "@nestjs/common";
import { CustomerContactEntity } from "src/entities/psql/CustomerContactEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CUSTOMER_CONTACT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CUSTOMER_CONTACT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CUSTOMER_CONTACT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CUSTOMER_CONTACT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerContactEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];