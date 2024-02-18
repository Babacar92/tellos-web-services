import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { CustomerTimelineEntity } from "../../../entities/psql/CustomerTimelineEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The CustomerTimeline Logger
 */
@Injectable()
export class CustomerTimelineLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "customer",
        "login",
        "file",
        "title",
        "type",
        "comment",
        "dateFrom",
        "dateTo",
        "isTodo",
        "doneAt",
        "active",
    ];

    public entityClassName: string = CustomerTimelineEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.CUSTOMER_TIMELINE_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.CUSTOMER_TIMELINE_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.CUSTOMER_TIMELINE_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CUSTOMER_TIMELINE_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CUSTOMER_TIMELINE_DELETE, data);
    }

}