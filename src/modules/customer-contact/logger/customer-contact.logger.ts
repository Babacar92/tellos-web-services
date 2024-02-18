import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { CustomerContactEntity } from "../../../entities/psql/CustomerContactEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The CustomerContact Logger
 */
@Injectable()
export class CustomerContactLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "picture",
        "customer",
        "lastname",
        "firstname",
        "company",
        "department",
        "position",
        "email",
        "phone",
        "phoneFix",
        "active",
    ];

    public entityClassName: string = CustomerContactEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.CUSTOMER_CONTACT_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.CUSTOMER_CONTACT_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.CUSTOMER_CONTACT_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CUSTOMER_CONTACT_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CUSTOMER_CONTACT_DELETE, data);
    }

}