import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { MedicalVisitEntity } from "../../../entities/psql/MedicalVisitEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The MedicalVisit Logger
 */
@Injectable()
export class MedicalVisitLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "entity",
        "service",
        "contract",
        "statut",
        "startDate",
        "endDate",
        "employee",
        "lastDateMedicalVisit",
        "nextDateMedicalVisit",
        "placeOfTheMedicalvisit",
        "contraindication",
        "file",
        "active",
    ];

    public entityClassName: string = MedicalVisitEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.MEDICAL_VISIT_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.MEDICAL_VISIT_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.MEDICAL_VISIT_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.MEDICAL_VISIT_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.MEDICAL_VISIT_DELETE, data);
    }

}