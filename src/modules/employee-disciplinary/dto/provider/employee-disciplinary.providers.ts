import { Provider } from "@nestjs/common";
import { EmployeeDisciplinaryEntity } from "src/entities/psql/EmployeeDisciplinaryEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum EMPLOYEE_DISCIPLINARY_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'EMPLOYEE_DISCIPLINARY_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const EMPLOYEE_DISCIPLINARY_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: EMPLOYEE_DISCIPLINARY_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(EmployeeDisciplinaryEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];