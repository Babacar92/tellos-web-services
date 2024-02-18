import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { MediumSizedCentreEntity } from "../../../entities/psql/MediumSizedCentreEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The MediumSizedCentre Logger
 */
@Injectable()
export class MediumSizedCentreLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "code",
        "label",
        "active",
    ];

    public entityClassName: string = MediumSizedCentreEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.MEDIUM_SIZED_CENTRE_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.MEDIUM_SIZED_CENTRE_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.MEDIUM_SIZED_CENTRE_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.MEDIUM_SIZED_CENTRE_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.MEDIUM_SIZED_CENTRE_DELETE, data);
    }

}