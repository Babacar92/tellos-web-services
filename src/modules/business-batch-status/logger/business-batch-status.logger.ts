import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { BusinessBatchStatusEntity } from "../../../entities/psql/BusinessBatchStatusEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The BusinessBatchStatus Logger
 */
@Injectable()
export class BusinessBatchStatusLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "title",
        "active",
    ];

    public entityClassName: string = BusinessBatchStatusEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.BUSINESS_BATCH_STATUS_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.BUSINESS_BATCH_STATUS_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.BUSINESS_BATCH_STATUS_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_BATCH_STATUS_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_BATCH_STATUS_DELETE, data);
    }

}