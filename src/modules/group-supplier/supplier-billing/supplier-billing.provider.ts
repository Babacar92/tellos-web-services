import { Provider } from '@nestjs/common';
import { SupplierBilling } from '@/entities/psql/supplier-billing.entity';
import { DataSource } from 'typeorm';
import { PSQL_DB_CONN_NAME } from '@/datasource-config';

/**
 * User Providers Names
 */
export enum SUPPLIER_BILLING_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'SUPPLIER_BILLING_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const SUPPLIER_BILLING_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: SUPPLIER_BILLING_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(SupplierBilling),
        inject: [PSQL_DB_CONN_NAME],
    },
];
