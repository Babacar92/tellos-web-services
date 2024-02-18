import { Provider } from '@nestjs/common';
import { SupplierCategoryEntity } from 'src/entities/psql/SupplierCategoryEntity';
import { DataSource } from 'typeorm';
import { PSQL_DB_CONN_NAME } from '../../../../../datasource-config';

/**
 * User Providers Names
 */
export enum SUPPLIER_CATEGORY_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'SUPPLIER_CATEGORY_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const ZONE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: SUPPLIER_CATEGORY_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(SupplierCategoryEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];
