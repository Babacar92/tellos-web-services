import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { AdministrativeMaterialEntity } from "../../../entities/psql/AdministrativeMaterialEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The AdministrativeMaterial Logger
 */
@Injectable()
export class AdministrativeMaterialLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "monthlyRent",
        "monthlyRent",
        "maintenanceRent",
        "maxAuthorizedKm",
        "BuybackValue",
        "fixedAssetCode",
        "salePrice",
        "geolocatizationBoxNumber",
        "monthlyUnitPrice",
        "TSVRPurchase",
        "TSVRTransfer",
        "totalCard",
        "PASSango",
        "breakevenPoint",
        "utilizationRate",
        "comment",
        "Financing",
        "exitType",
        "typeOfSale",
        "pendingExit",
        "carFleetInsurance",
        "machineryInsurance",
        "contractStartDate",
        "contractEndDate",
        "saleDate",
        "active",
    ];

    public entityClassName: string = AdministrativeMaterialEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.ADMINISTRATIVE_MATERIAL_CREATE, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.ADMINISTRATIVE_MATERIAL_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.ADMINISTRATIVE_MATERIAL_CREATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.ADMINISTRATIVE_MATERIAL_CREATE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.ADMINISTRATIVE_MATERIAL_CREATE, data);
    }

}