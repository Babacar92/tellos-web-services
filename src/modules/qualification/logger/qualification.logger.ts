import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { QualificationEntity } from "../../../entities/psql/QualificationEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The Qualification Logger
 */
@Injectable()
export class QualificationLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "entity",
        "department",
        "employee",
        "type",
        "name",
        "document",
        "number",
        "delivery",
        "deadline",
        "validity",
        "comment",
        "status",
        "fromMyAccount",
        "active",
    ];

    public entityClassName: string = QualificationEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.QUALIFICATION_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.QUALIFICATION_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.QUALIFICATION_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.QUALIFICATION_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.QUALIFICATION_DELETE, data);
    }

}