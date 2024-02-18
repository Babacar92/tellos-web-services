import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { TheoreticalHoursOfUseEntity } from "../../../entities/psql/TheoreticalHoursOfUseEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The TheoreticalHoursOfUse Logger
 */
@Injectable()
export class TheoreticalHoursOfUseLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "year",
        "hoursNumber",
        "active",
    ];

    public entityClassName: string = TheoreticalHoursOfUseEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.QUALIFICATION_NAME_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.QUALIFICATION_NAME_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.QUALIFICATION_NAME_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.QUALIFICATION_NAME_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.QUALIFICATION_NAME_DELETE, data);
    }

}