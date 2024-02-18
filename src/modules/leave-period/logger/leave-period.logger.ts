import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { LeavePeriodEntity } from "../../../entities/psql/LeavePeriodEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The Leave Logger
 */
@Injectable()
export class LeavePeriodLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "countUsableLeave",
        "countAcquiredLeave",
        "dateTo",
        "dateFrom",
        "employee",
        "active",
    ];

    public entityClassName: string = LeavePeriodEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.LEAVE_PERIOD_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.LEAVE_PERIOD_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.LEAVE_PERIOD_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.LEAVE_PERIOD_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.LEAVE_PERIOD_DELETE, data);
    }

}