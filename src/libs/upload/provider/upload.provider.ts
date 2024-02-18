import { UploadEntity } from "src/entities/psql/UploadEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../datasource-config";

/**
 * Providers Names
 */
export enum UPLOAD_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = "UPLOAD_PROVIDER_DEFAULT_REPOSITORY",
}

/**
 * List of default Upload's Providers
 */
export const UPLOAD_PROVIDERS = [
    // Repository
    {
        provide: UPLOAD_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UploadEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];