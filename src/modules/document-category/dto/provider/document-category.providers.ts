import { Provider } from "@nestjs/common";
import { DocumentCategoryEntity } from "src/entities/psql/DocumentCategoryEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum DOCUMENT_CATEGORY_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'DOCUMENT_CATEGORY_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const DOCUMENT_CATEGORY_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: DOCUMENT_CATEGORY_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(DocumentCategoryEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];