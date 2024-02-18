import { Provider } from "@nestjs/common";
import { EmployeeDocumentEntity } from "src/entities/psql/EmployeeDocumentEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum EMPLOYEE_DOCUMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'EMPLOYEE_DOCUMENT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const EMPLOYEE_DOCUMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: EMPLOYEE_DOCUMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(EmployeeDocumentEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];