import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { ContractInfoEntity } from "../../../entities/psql/ContractInfoEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The ContractInfo Logger
 */
@Injectable()
export class ContractInfoLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "employee",
        "typeContract",
        "typeEntry",
        "typePayment",
        "apprentice",
        "section",
        "level",
        "jobDescription",
        "entryDate",
        "seniorityDate",
        "sagePayCode",
        "endTrialPeriod",
        "renewal",
        "endRenewal",
        "endContractCdd",
        "amendmentCdd",
        "departureDate",
        "leavingRaison",
        "job",
        "category",
        "code",
        "position",
        "coefficient",
        "largeRateDep",
        "ageCategory",
        "active",
    ];

    public entityClassName: string = ContractInfoEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.CONTRACT_INFO_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.CONTRACT_INFO_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.CONTRACT_INFO_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CONTRACT_INFO_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CONTRACT_INFO_DELETE, data);
    }

}