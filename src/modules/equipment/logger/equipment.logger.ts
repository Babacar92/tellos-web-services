import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { EquipmentEntity } from "../../../entities/psql/EquipmentEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The Equipment Logger
 */
@Injectable()
export class EquipmentLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "denomination",
        "code",
        "registrationNumber",
        "orderNumber",
        "categorie",
        "photo",
        "employee",
        "type",
        "entity",
        "available",
        "sectionCode",
        "startDate",
        "endDate",
        "orderDate",
        "deliveryDate",
        "firstCirculation",
        "registrationDate",
        "originalValue",
        "counter",
        "standardCost",
        "co2Emissions",
        "active",
    ];

    public entityClassName: string = EquipmentEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.EQUIPMENT_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.EQUIPMENT_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.EQUIPMENT_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.EQUIPMENT_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.EQUIPMENT_DELETE, data);
    }

}