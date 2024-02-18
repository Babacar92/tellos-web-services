import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { EmployeeDocumentEntity } from "../../../entities/psql/EmployeeDocumentEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The EmployeeDocument Logger
 */
@Injectable()
export class EmployeeDocumentLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "type",
        "file",
        "employee",
        "validateDate",
        "dunningDate",
        "signedDate",
        "status",
        "requireEmployeeSignature",
        "requireEmployeeUpload",
        "active",
    ];

    public entityClassName: string = EmployeeDocumentEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.EMPLOYEE_DOCUMENT_DELETE, data);
    }

}