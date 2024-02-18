import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { LeaveDistributionEntity } from "../../../entities/psql/LeaveDistributionEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The LeaveDistribution Logger
 */
@Injectable()
export class LeaveDistributionLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "name",
        "total",
        "leave",
        "active",
    ];

    public entityClassName: string = LeaveDistributionEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.LEAVE_DISTRIBUTION_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.LEAVE_DISTRIBUTION_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.LEAVE_DISTRIBUTION_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.LEAVE_DISTRIBUTION_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.LEAVE_DISTRIBUTION_DELETE, data);
    }

}