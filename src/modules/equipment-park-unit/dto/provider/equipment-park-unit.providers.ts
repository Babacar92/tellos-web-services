import { Provider } from "@nestjs/common";
import { EquipmentParkUnitEntity } from "src/entities/psql/EquipmentParkUnitEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum STOCK_UNIT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'STOCK_UNIT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const STOCK_UNIT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: STOCK_UNIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(EquipmentParkUnitEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];