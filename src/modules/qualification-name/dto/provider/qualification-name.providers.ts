import { Provider } from "@nestjs/common";
import { QualificationNameEntity } from "src/entities/psql/QualificationNameEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum QUALIFICATION_NAME_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'QUALIFICATION_NAME_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const QUALIFICATION_NAME_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: QUALIFICATION_NAME_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(QualificationNameEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];