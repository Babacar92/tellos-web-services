import { Provider } from '@nestjs/common';
import { SupplierLanguageCodeEntity } from '@Entities/SupplierLanguageCodeEntity';
import { DataSource } from 'typeorm';
import { PSQL_DB_CONN_NAME } from '@/datasource-config';

/**
 * User Providers Names
 */
export enum SUPPLIER_LANGUAGE_CODE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'SUPPLIER_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const SUPPLIER_LANGUAGE_CODE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: SUPPLIER_LANGUAGE_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(SupplierLanguageCodeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];
