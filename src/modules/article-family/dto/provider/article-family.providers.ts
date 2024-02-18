import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { ArticleFamilyEntity } from "../../../../entities/psql/ArticleFamilyEntity";

/**
 * User Providers Names
 */
export enum ARTICLE_FAMILY_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'ARTICLE_FAMILY_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const ARTICLE_FAMILY_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: ARTICLE_FAMILY_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ArticleFamilyEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];