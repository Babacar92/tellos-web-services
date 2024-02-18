import { Provider } from "@nestjs/common";
import { ExpensePostEntity } from "src/entities/psql/ExpensePostEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum EXPENSE_POST_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'EXPENSE_POST_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const EXPENSE_POST_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: EXPENSE_POST_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExpensePostEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];