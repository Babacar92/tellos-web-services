import { Provider } from '@nestjs/common';
import { Supplier } from '@/entities/psql/supplier.entity';
import { DataSource } from 'typeorm';
import { PSQL_DB_CONN_NAME } from '@/datasource-config';

/**
 * User Providers Names
 */
export enum SUPPLIER_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'SUPPLIER_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const SUPPLIER_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: SUPPLIER_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(Supplier),
        inject: [PSQL_DB_CONN_NAME],
    },
];
