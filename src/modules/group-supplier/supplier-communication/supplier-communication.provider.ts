//NestJS
import { Provider } from '@nestjs/common';
//Entities
import { SupplierCommunicationEntity } from '@Entities/SupplierCommunicationEntity';

//TypeOrm
import { DataSource } from 'typeorm';

//Datasource
import { PSQL_DB_CONN_NAME } from '@/datasource-config';

//Supplier Communication
export enum SUPPLIER_COMMUNICATION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'SUPPLIER_COMMUNICATION_DEFAULT_REPOSITORY',
}

export const SUPPLIER_COMMUNICATION_PROVIDERS: Provider[] = [
    {
        provide: SUPPLIER_COMMUNICATION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(SupplierCommunicationEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];
