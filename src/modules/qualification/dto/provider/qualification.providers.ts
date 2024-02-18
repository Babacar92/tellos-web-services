import { Provider } from "@nestjs/common";
import { QualificationEntity } from "src/entities/psql/QualificationEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum QUALIFICATION_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'QUALIFICATION_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const QUALIFICATION_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: QUALIFICATION_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(QualificationEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];