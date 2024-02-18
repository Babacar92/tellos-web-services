import { Provider } from '@nestjs/common';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { DataSource } from 'typeorm';
import { PSQL_DB_CONN_NAME } from '../../../../datasource-config';
import { ActionLogService } from '../../../action-log/services/action-log.service';
import { CategoryEquipmentActionLogEventSubscriber } from '../../subscribers/CategoryEquipmentActionLogEventSubscriber';

/**
 * User Providers Names
 */
export enum CATEGORY_EQUIPMENT_PROVIDERS_NAMES {
    DEFAULT_REPOSITORY = 'CATEGORY_EQUIPMENT_DEFAULT_REPOSITORY',
    EVENT_SUBSRIBER = 'CATEGORY_EQUIPMENT_EVENT_SUBSRIBER',
}

/**
 * User Providers
 */
export const CATEGORY_EQUIPMENT_PROVIDERS: Provider[] = [
    // REPOSITORY FOR DEFAULT DB
    {
        provide: CATEGORY_EQUIPMENT_PROVIDERS_NAMES.DEFAULT_REPOSITORY,
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(CategoryEquipment),
        inject: [PSQL_DB_CONN_NAME],
    },
    // EVENT SUBSCRIBER OF USER
    {
        provide: CATEGORY_EQUIPMENT_PROVIDERS_NAMES.EVENT_SUBSRIBER,
        useFactory(dataSource: DataSource, reqCurrentUser: ActionLogService) {
            return new CategoryEquipmentActionLogEventSubscriber(
                dataSource,
                reqCurrentUser,
            );
        },
        inject: [PSQL_DB_CONN_NAME, ActionLogService],
    },
];
