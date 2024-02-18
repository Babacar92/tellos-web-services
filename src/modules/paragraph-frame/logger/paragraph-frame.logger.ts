import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { ParagraphFrameEntity } from "../../../entities/psql/ParagraphFrameEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The ParagraphFrame Logger
 */
@Injectable()
export class ParagraphFrameLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "category",
        "title",
        "content",
        "active",
    ];

    public entityClassName: string = ParagraphFrameEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.PARAGRAPH_FRAME_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.PARAGRAPH_FRAME_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.PARAGRAPH_FRAME_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.PARAGRAPH_FRAME_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.PARAGRAPH_FRAME_DELETE, data);
    }

}