import { Provider } from "@nestjs/common";
import { CustomerDocumentEntity } from "src/entities/psql/CustomerDocumentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CUSTOMER_DOCUMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CUSTOMER_DOCUMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CUSTOMER_DOCUMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CUSTOMER_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerDocumentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];