import { Provider } from "@nestjs/common";
import { GoodReferencePriceEntity } from "src/entities/psql/GoodReferencePriceEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum GOOD_REFERENCE_PRICE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'GOOD_REFERENCE_PRICE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const GOOD_REFERENCE_PRICE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: GOOD_REFERENCE_PRICE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(GoodReferencePriceEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];