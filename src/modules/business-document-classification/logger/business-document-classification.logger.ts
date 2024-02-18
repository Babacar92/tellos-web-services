import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { BusinessDocumentClassificationEntity } from "../../../entities/psql/BusinessDocumentClassificationEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The BusinessDocumentClassification Logger
 */
@Injectable()
export class BusinessDocumentClassificationLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "title",
        "active",
    ];

    public entityClassName: string = BusinessDocumentClassificationEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.BUSINESS_DOCUMENT_CLASSIFICATION_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.BUSINESS_DOCUMENT_CLASSIFICATION_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.BUSINESS_DOCUMENT_CLASSIFICATION_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_DOCUMENT_CLASSIFICATION_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_DOCUMENT_CLASSIFICATION_DELETE, data);
    }

}