import { Provider } from "@nestjs/common";
import { BusinessMarketTypeEntity } from "src/entities/psql/BusinessMarketTypeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_MARKET_TYPE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_MARKET_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_MARKET_TYPE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_MARKET_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessMarketTypeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];