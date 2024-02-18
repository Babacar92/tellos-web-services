import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { ParagraphFrameEntity } from "src/entities/psql/ParagraphFrameEntity";

/**
 * User Providers Names
 */
export enum PARAGRAPH_FRAME_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'PARAGRAPHFRAME_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const PARAGRAPH_FRAME_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: PARAGRAPH_FRAME_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ParagraphFrameEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];