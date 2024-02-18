import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { BusinessEntity } from "../../../entities/psql/BusinessEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The Business Logger
 */
@Injectable()
export class BusinessLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "customer",
        "paymentMode",
        "paymentType",
        "tenderType",
        "marketType",
        "worksChief",
        "worksManager",
        "mainSiteManager",
        "siteManager2",
        "siteManager3",
        "commercial",
        "picture",
        "email",
        "code",
        "label",
        "externalCode",
        "payingOwner",
        "mainOwner",
        "underCover",
        "owner",
        "origin",
        "estimatedAmount",
        "referenceCase",
        "bidBond",
        "startDate",
        "endDate",
        "startDateStudy",
        "endDateStudy",
        "workDuration",
        "unit",
        "type",
        "status",
        "applicationDate",
        "retrieveDate",
        "limiteDate",
        "depositDate",
        "agency",
        "address",
        "postalCode",
        "city",
        "country",
        "phone",
        "website",
        "gps",
        "delegatedCustomer",
        "economist",
        "engineeringOffice",
        "fuildEngineeringOffice",
        "groundEngineeringOffice",
        "controlOffice",
        "pilot",
        "safetyCoordinator",
        "isEditable",
        "active",
    ];

    public entityClassName: string = BusinessEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.BUSINESS_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.BUSINESS_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.BUSINESS_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.BUSINESS_DELETE, data);
    }

}