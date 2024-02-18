import { Provider } from "@nestjs/common";
import { BusinessTenderTypeEntity } from "src/entities/psql/BusinessTenderTypeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_TENDER_TYPE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_TENDER_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_TENDER_TYPE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_TENDER_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessTenderTypeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];