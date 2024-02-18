import { Provider } from "@nestjs/common";
import { ContractTypePaymentEntity } from "src/entities/psql/ContractTypePaymentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CONTRACT_TYPE_PAYMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CONTRACT_TYPE_PAYMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CONTRACT_TYPE_PAYMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CONTRACT_TYPE_PAYMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ContractTypePaymentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];