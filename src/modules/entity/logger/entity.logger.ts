import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { EntityEntity } from "../../../entities/psql/EntityEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The Entity Logger
 */
@Injectable()
export class EntityLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "logo",
        "label",
        "organigramme",
        "totalEmployees",
        "creationDate",
        "linkedin",
        "colorGradiantLeft",
        "colorGradiantRight",
        "colorHeader",
        "colorSticker",
        "description",
        "type",
        "active",
    ];

    public entityClassName: string = EntityEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.ENTITY_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.ENTITY_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.ENTITY_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.ENTITY_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.ENTITY_DELETE, data);
    }

}