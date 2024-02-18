import { Provider } from "@nestjs/common";
import { JobDescriptionEntity } from "src/entities/psql/JobDescriptionEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum JOB_DESCRIPTION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'JOB_DESCRIPTION_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const JOB_DESCRIPTION_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: JOB_DESCRIPTION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(JobDescriptionEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];