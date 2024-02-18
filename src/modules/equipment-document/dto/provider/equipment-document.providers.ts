import { Provider } from "@nestjs/common";
import { EquipmentDocumentEntity } from "src/entities/psql/EquipmentDocumentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum EQUIPMENT_DOCUMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'EQUIPMENT_DOCUMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const EQUIPMENT_DOCUMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: EQUIPMENT_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(EquipmentDocumentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];