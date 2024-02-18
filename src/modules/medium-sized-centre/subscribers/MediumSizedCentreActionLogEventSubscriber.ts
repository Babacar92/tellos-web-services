import { MediumSizedCentreEntity } from "src/entities/psql/MediumSizedCentreEntity";
import { EntitySubscriberInterface, EventSubscriber, LoadEvent, SoftRemoveEvent, UpdateEvent, RemoveEvent, InsertEvent, DataSource } from "typeorm";
import { getCurrentUser } from "../../../libs/databases/utils/db.utils";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLogService } from "../../action-log/services/action-log.service";
import { LoginEntity } from "src/entities/psql/LoginEntity";

/**
 * The subscriber event
 */
@EventSubscriber()
export class MediumSizedCentreActionLogEventSubscriber implements EntitySubscriberInterface<MediumSizedCentreEntity> {

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
    public listenTo(): typeof MediumSizedCentreEntity {
        return MediumSizedCentreEntity;
    }

    /**
     * The after load subscriber
     * @param entity 
     * @param event 
     */
    public afterLoad(
        entity: any,
        event?: LoadEvent<MediumSizedCentreEntity>
    ): void | Promise<any> {

    }

    /**
     * The after update subscriber
     * @param event 
     */
    public afterInsert(
        event: InsertEvent<MediumSizedCentreEntity>
    ): void | Promise<any> {
        const user = getCurrentUser();

        if (user && event.entity) {
            this._actionLogService.log({
                type: ACTION_LOG_TYPES.MEDIUM_SIZED_CENTRE_CREATE,
                user: {
                    id: user.sub,
                    entity: LoginEntity.name,
                },
                data: <MediumSizedCentreEntity>{
                    id: event.entity.id,
                    code: event.entity.code,
                },
            });
        }
    }

    /**
     * The after update subscriber
     * @param event 
     */
    public afterUpdate(
        event: UpdateEvent<MediumSizedCentreEntity>
    ): void | Promise<any> {
        const user = getCurrentUser();

        if (user && event.entity && event.databaseEntity) {
            const oldEntity = <MediumSizedCentreEntity>{
                id: event.databaseEntity.id,
                code: event.databaseEntity.code,
            };

            const currentEntity = <MediumSizedCentreEntity>{
                id: event.databaseEntity.id,
                code: event.databaseEntity.code,
            };

            for (let i in event.updatedColumns) {
                const {
                    propertyName,
                } = event.updatedColumns[i];

                oldEntity[propertyName] = event.databaseEntity[propertyName];
                currentEntity[propertyName] = event.entity[propertyName];
            }

            this._actionLogService.log({
                type: ACTION_LOG_TYPES.MEDIUM_SIZED_CENTRE_UPDATE,
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
        event: SoftRemoveEvent<MediumSizedCentreEntity>
    ): void | Promise<any> {
        const user = getCurrentUser();

        if (user) {
        }
    }

    /**
     * The after remove subscriber
     * @param event 
     */
    public afterRemove(
        event: RemoveEvent<MediumSizedCentreEntity>
    ): void {
        const user = getCurrentUser();

        if (user) {
        }
    }

}