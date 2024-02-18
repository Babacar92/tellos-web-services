import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    LoadEvent,
    SoftRemoveEvent,
    UpdateEvent,
    RemoveEvent,
    InsertEvent,
    DataSource,
} from 'typeorm';
import { getCurrentUser } from '../../../libs/databases/utils/db.utils';
import { ACTION_LOG_TYPES } from '../../action-log/dto/types/actions.types.enum';
import { ActionLogService } from '../../action-log/services/action-log.service';
import { LoginEntity } from 'src/entities/psql/LoginEntity';

/**
 * The subscriber event
 */
@EventSubscriber()
export class CategoryEquipmentActionLogEventSubscriber
    implements EntitySubscriberInterface<CategoryEquipment>
{
    public constructor(
        dataSource: DataSource,
        private readonly _actionLogService: ActionLogService,
    ) {
        dataSource.subscribers?.push(this);
    }

    /**
     *
     * @returns The user Entity
     */
    public listenTo(): typeof CategoryEquipment {
        return CategoryEquipment;
    }

    /**
     * The after load subscriber
     * @param entity
     * @param event
     */
    public afterLoad(
        entity: any,
        event?: LoadEvent<CategoryEquipment>,
    ): void | Promise<any> {}

    /**
     * The after update subscriber
     * @param event
     */
    public afterInsert(
        event: InsertEvent<CategoryEquipment>,
    ): void | Promise<any> {
        const user = getCurrentUser();

        if (user && event.entity) {
            this._actionLogService.log({
                type: ACTION_LOG_TYPES.CATEGORY_EQUIPMENT_CREATE,
                user: {
                    id: user.sub,
                    entity: LoginEntity.name,
                },
                data: <CategoryEquipment>{
                    id: event.entity.id,
                    title: event.entity.title,
                },
            });
        }
    }

    /**
     * The after update subscriber
     * @param event
     */
    public afterUpdate(
        event: UpdateEvent<CategoryEquipment>,
    ): void | Promise<any> {
        const user = getCurrentUser();

        if (user && event.entity && event.databaseEntity) {
            const oldEntity = <CategoryEquipment>{
                id: event.databaseEntity.id,
                title: event.databaseEntity.title,
            };

            const currentEntity = <CategoryEquipment>{
                id: event.databaseEntity.id,
                title: event.databaseEntity.title,
            };

            for (let i in event.updatedColumns) {
                const { propertyName } = event.updatedColumns[i];

                oldEntity[propertyName] = event.databaseEntity[propertyName];
                currentEntity[propertyName] = event.entity[propertyName];
            }

            this._actionLogService.log({
                type: ACTION_LOG_TYPES.CATEGORY_EQUIPMENT_UPDATE,
                user: {
                    id: user.sub,
                    entity: LoginEntity.name,
                },
                data: {
                    oldEntity: oldEntity,
                    currentEntity: currentEntity,
                },
            });
        }
    }

    /**
     * The after soft remove subscriber
     * @param event
     */
    public afterSoftRemove(
        event: SoftRemoveEvent<CategoryEquipment>,
    ): void | Promise<any> {
        const user = getCurrentUser();

        if (user) {
        }
    }

    /**
     * The after remove subscriber
     * @param event
     */
    public afterRemove(event: RemoveEvent<CategoryEquipment>): void {
        const user = getCurrentUser();

        if (user) {
        }
    }
}
