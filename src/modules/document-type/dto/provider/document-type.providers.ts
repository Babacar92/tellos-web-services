import { Provider } from "@nestjs/common";
import { DocumentTypeEntity } from "src/entities/psql/DocumentTypeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum DOCUMENT_TYPE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'DOCUMENT_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const DOCUMENT_TYPE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: DOCUMENT_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(DocumentTypeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];