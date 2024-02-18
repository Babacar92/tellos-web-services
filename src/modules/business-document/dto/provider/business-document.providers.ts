import { Provider } from "@nestjs/common";
import { BusinessDocumentEntity } from "src/entities/psql/BusinessDocumentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_DOCUMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_DOCUMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_DOCUMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessDocumentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];