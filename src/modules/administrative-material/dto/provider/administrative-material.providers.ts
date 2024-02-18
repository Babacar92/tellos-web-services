import { Provider } from "@nestjs/common";
import { AdministrativeMaterialEntity } from "src/entities/psql/AdministrativeMaterialEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum ADMINISTRATIVE_MATERIAL_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'ADMINISTRATIVE_MATERIAL_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const ADMINISTRATIVE_MATERIAL_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: ADMINISTRATIVE_MATERIAL_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(AdministrativeMaterialEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];