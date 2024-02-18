import { Provider } from "@nestjs/common";
import { MediumSizedCentreEntity } from "src/entities/psql/MediumSizedCentreEntity";
import { DataSource } from "typeorm";
import { PSQL_DB_CONN_NAME } from "../../../../datasource-config";
import { ActionLogService } from "../../../action-log/services/action-log.service";
import { MediumSizedCentreActionLogEventSubscriber } from "../../subscribers/MediumSizedCentreActionLogEventSubscriber";

/**
 * User Providers Names
 */
export enum MEDIUM_SIZED_CENTRE_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'MEDIUM_SIZED_CENTRE_DEFAULT_REPOSITORY',
    EVENT_SUBSRIBER = 'MEDIUM_SIZED_CENTRE_EVENT_SUBSRIBER',
}

/**
 * User Providers
 */
export const MEDIUM_SIZED_CENTRE_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: MEDIUM_SIZED_CENTRE_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(MediumSizedCentreEntity),
        inject: [PSQL_DB_CONN_NAME],
    },
    // EVENT SUBSCRIBER OF USER
    {
        provide: MEDIUM_SIZED_CENTRE_PROVIDERS_NAMES.EVENT_SUBSRIBER,
        useFactory(
            dataSource: DataSource,
            reqCurrentUser: ActionLogService,
        ) {
            return new MediumSizedCentreActionLogEventSubscriber(dataSource, reqCurrentUser);
        },
        inject: [
            PSQL_DB_CONN_NAME,
            ActionLogService,
        ],
    },
];