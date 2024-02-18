import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { LeaveEntity } from "src/entities/psql/LeaveEntity";

/**
 * User Providers Names
 */
export enum LEAVE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'LEAVE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const LEAVE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: LEAVE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LeaveEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];