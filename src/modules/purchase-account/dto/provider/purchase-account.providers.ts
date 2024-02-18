import { Provider } from "@nestjs/common";
import { PurchaseAccountEntity } from "src/entities/psql/PurchaseAccountEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum PURCHASE_ACCOUNT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'PURCHASE_ACCOUNT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const PURCHASE_ACCOUNT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: PURCHASE_ACCOUNT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PurchaseAccountEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];