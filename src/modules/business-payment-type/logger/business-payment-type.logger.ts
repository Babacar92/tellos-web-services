import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { BusinessPaymentTypeEntity } from "../../../entities/psql/BusinessPaymentTypeEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The BusinessPaymentType Logger
 */
@Injectable()
export class BusinessPaymentTypeLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "title",
        "active",
    ];

    public entityClassName: string = BusinessPaymentTypeEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.BUSINESS_PAYMENT_TYPE_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.BUSINESS_PAYMENT_TYPE_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.BUSINESS_PAYMENT_TYPE_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_PAYMENT_TYPE_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_PAYMENT_TYPE_DELETE, data);
    }

}