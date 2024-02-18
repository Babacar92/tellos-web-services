import { Provider } from "@nestjs/common";
import { BusinessPaymentTypeEntity } from "src/entities/psql/BusinessPaymentTypeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_PAYMENT_TYPE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_PAYMENT_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_PAYMENT_TYPE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_PAYMENT_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessPaymentTypeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];