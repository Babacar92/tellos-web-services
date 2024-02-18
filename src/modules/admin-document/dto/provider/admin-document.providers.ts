import { Provider } from "@nestjs/common";
import { AdminDocumentEntity } from "src/entities/psql/AdminDocumentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum ADMIN_DOCUMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'ADMIN_DOCUMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const ADMIN_DOCUMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: ADMIN_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(AdminDocumentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];