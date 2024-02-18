//NestJS
import { Provider } from '@nestjs/common';
//Entities
import { SupplierContact } from '@/entities/psql/supplier-contact.entity';

//TypeOrm
import { DataSource } from 'typeorm';

//Datasource
import { PSQL_DB_CONN_NAME } from '@/datasource-config';

//Supplier Contact
export enum SUPPLIER_CONTACT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'SUPPLIER_CONTACT_DEFAULT_REPOSITORY',
}

export const SUPPLIER_CONTACT_PROVIDERS: Provider[] = [
    {
        provide: SUPPLIER_CONTACT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(SupplierContact),
        inject: [PSQL_DB_CONN_NAME],
    },
];
