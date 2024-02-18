import { Provider } from '@nestjs/common';
import { Good } from 'src/entities/psql/good.entity';
import { DataSource } from 'typeorm';
import { PSQL_DB_CONN_NAME } from '../../datasource-config';

/**
 * User Providers Names
 */
export enum WORK_UNIT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'WORK_UNIT_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const WORK_UNIT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: WORK_UNIT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Good),
        inject: [PSQL_DB_CONN_NAME],
    },
];
