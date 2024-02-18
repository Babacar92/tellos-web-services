import { Provider } from "@nestjs/common";
import { BusinessBudgetEntity } from "src/entities/psql/BusinessBudgetEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum BUSINESS_BUDGET_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'BUSINESS_BUDGET_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const BUSINESS_BUDGET_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: BUSINESS_BUDGET_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(BusinessBudgetEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];