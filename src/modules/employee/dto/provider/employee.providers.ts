import { Provider } from '@nestjs/common';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { DataSource } from 'typeorm';
import { PSQL_DB_CONN_NAME } from '../../../../datasource-config';

/**
 * User Providers Names
 */
export enum EMPLOYEE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'EMPLOYEE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const EMPLOYEE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: EMPLOYEE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(Employee),
        inject: [PSQL_DB_CONN_NAME],
    },
];
