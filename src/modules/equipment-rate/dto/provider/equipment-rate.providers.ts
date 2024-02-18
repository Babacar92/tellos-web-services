import { Provider } from "@nestjs/common";
import { EquipmentRateEntity } from "src/entities/psql/EquipmentRateEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum EQUIPMENT_RATE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'EQUIPMENT_RATE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const EQUIPMENT_RATE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: EQUIPMENT_RATE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(EquipmentRateEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];