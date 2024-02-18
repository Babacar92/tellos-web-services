import { Provider } from "@nestjs/common";
import { EquipmentEntity } from "src/entities/psql/EquipmentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum EQUIPMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'EQUIPMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const EQUIPMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: EQUIPMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(EquipmentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];