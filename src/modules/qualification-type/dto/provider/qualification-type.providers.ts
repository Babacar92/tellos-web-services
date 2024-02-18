import { Provider } from "@nestjs/common";
import { QualificationTypeEntity } from "src/entities/psql/QualificationTypeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum QUALIFICATION_TYPE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'QUALIFICATION_TYPE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const QUALIFICATION_TYPE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: QUALIFICATION_TYPE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(QualificationTypeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];