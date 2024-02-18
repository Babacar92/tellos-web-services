import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { TokenEntity } from "../../../entities/psql/TokenEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The Token Logger
 */
@Injectable()
export class TokenLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "title",
        "active",
    ];

    public entityClassName: string = TokenEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

}