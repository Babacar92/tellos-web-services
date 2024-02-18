import { Provider } from "@nestjs/common";
import { SectionCodeEntity } from "src/entities/psql/SectionCodeEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum SECTION_CODE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'SECTION_CODE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const SECTION_CODE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: SECTION_CODE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(SectionCodeEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];