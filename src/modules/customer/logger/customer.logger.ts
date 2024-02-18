import { Injectable } from "@nestjs/common";
import { AbstractLogger } from "../../../libs/logger/abstract.logger";
import { CustomerEntity } from "../../../entities/psql/CustomerEntity";
import { ACTION_LOG_TYPES } from "../../action-log/dto/types/actions.types.enum";
import { ActionLog } from "../../../entities/mongodb/ActionLogSchema";
import { ActionLogService } from "../../action-log/services/action-log.service";

/**
 * The Customer Logger
 */
@Injectable()
export class CustomerLogger extends AbstractLogger {

    public columns: string[] = [
        "id",
        "picture",
        "name",
        "email",
        "code",
        "address",
        "addressBis",
        "zipCode",
        "city",
        "country",
        "familly",
        "typology",
        "language",
        "phone",
        "fax",
        "siret",
        "ape",
        "tvaNumber",
        "taxeCode",
        "regulationCode",
        "currency",
        "rib",
        "domiciliation",
        "iban",
        "bic",
        "invoiceCopyNumber",
        "discountRate",
        "invoiceEmail",
        "active",
    ];

    public entityClassName: string = CustomerEntity.name;

    public constructor(
        public readonly _actionLogService: ActionLogService,
    ) {
        super();
    }

    public async read(
        data?: any
    ): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.CUSTOMER_READ, data);
    }

    public async create(
        data?: any
    ): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.CUSTOMER_CREATE, data);
    }

    public async update(
        data?: any,
        oldData?: any,
    ): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.CUSTOMER_UPDATE, data, oldData);
    }

    public async softDelete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CUSTOMER_SOFT_DELETE, data);
    }

    public async delete(
        data?: any
    ): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CUSTOMER_DELETE, data);
    }

}