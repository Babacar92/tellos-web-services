import { Provider } from "@nestjs/common";
import { CustomerNoteEntity } from "src/entities/psql/CustomerNoteEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";

/**
 * User Providers Names
 */
export enum CUSTOMER_NOTE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CUSTOMER_NOTE_DEFAULT_REPOSITORY',
}

/**
 * User Providers
 */
export const CUSTOMER_NOTE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CUSTOMER_NOTE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerNoteEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
];