import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { DepartmentEntity } from "../../../../entities/psql/DepartmentEntity";

/**
 * User Providers Names
 */
export enum DEPARTMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'DEPARTMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const DEPARTMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: DEPARTMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(DepartmentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];