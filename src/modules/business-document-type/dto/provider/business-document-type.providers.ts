import { Provider } from "@nestjs/common";
import { BusinessDocumentTypeEntity } from "src/entities/psql/BusinessDocumentTypeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_DOCUMENT_TYPE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_DOCUMENT_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_DOCUMENT_TYPE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_DOCUMENT_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessDocumentTypeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];