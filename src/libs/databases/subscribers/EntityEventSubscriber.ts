import { AppModule } from "src/app.module";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent, LoadEvent, UpdateEvent } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { getCurrentUser } from "../utils/db.utils";

@EventSubscriber()
export class EntityEventSubscriber implements EntitySubscriberInterface {

    public constructor() { }

    /**
     * Parse / Transform value after load
     * @param entity 
     * @param event 
     */
    public async afterLoad(entity: any, event?: LoadEvent<any>): Promise<void> {
        if (entity && event) {
            for (const k in event.metadata.columns) {
                const {
                    comment,
                    propertyName
                } = event.metadata.columns[k];

                let propertyValue = entity[propertyName];

                if (comment === `Translation column ${propertyName}`) {
                    const trans = AppModule.get(TranslationService);
                    if (trans && propertyValue) {
                        const {
                            key, domain,
                        } = JSON.parse(propertyValue);

                        propertyValue = JSON.parse(propertyValue);
                        entity[propertyName] = trans.trans(key, undefined, domain)?.getValue();
                    } else {
                        entity[propertyName] = null;
                    }
                }
            }
        }
    }

    /**
     * Call before entity insert
     * @param event 
     */
    public async beforeInsert(event: InsertEvent<any>): Promise<void> {
        if (event.entity) {
            await this._setValueForSpecialColumn(
                event.metadata.columns,
                event.entity,
                event.manager
            );
        }
    }

    /**
     * Called before entity update
     * @param event 
     */
    public async beforeUpdate(event: UpdateEvent<any>): Promise<void> {
        if (event.entity && event.entity.id) {
            if (event.metadata.propertiesMap.updatedBy) {
                await event.manager.update(event.metadata.target, event.entity.id, {
                    updatedBy: getCurrentUser()?.username,
                });
            }

            await this._setValueForSpecialColumn(event.updatedColumns, event.entity, event.manager);
        }
    }

    /**
     * 
     * @param columnsMetadata 
     * @param entity 
     * @param manager 
     */
    private async _setValueForSpecialColumn(
        columnsMetadata: ColumnMetadata[],
        entity: Object,
        manager: EntityManager
    ): Promise<any> {
        // Check the cryptaeble field
        for (const k in columnsMetadata) {
            const {
                comment,
                propertyName
            } = columnsMetadata[k];

            if (comment) {
                let propertyValue = entity[propertyName];

                if (comment === `Translation column ${propertyName}`) {
                    const trans = AppModule.get(TranslationService);
                    if (trans) {
                        if ((await trans.validate(propertyValue))) {

                            const {
                                key, domain, ...rest
                            } = propertyValue;

                            if (!(await trans.exist(key, domain))) {
                                await trans.addText(key, rest, domain);
                            }

                            entity[propertyName] = JSON.stringify({ key, domain });
                        } else {
                            entity[propertyName] = null;
                        }
                    } else {
                        entity[propertyName] = null;
                    }
                }
            }
        }
    }

}