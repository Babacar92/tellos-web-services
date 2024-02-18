import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '@Libs/logger/abstract.logger';
import { SupplierContact } from '@/entities/psql/supplier-contact.entity';
import { ACTION_LOG_TYPES } from '@Modules/action-log/dto/types/actions.types.enum';
import { ActionLog } from '@/entities/mongodb/ActionLogSchema';
import { ActionLogService } from '@Modules/action-log/services/action-log.service';

/**
 * The SupplierContact Logger
 */
@Injectable()
export class SupplierContactLogger extends AbstractLogger {
    public columns: string[] = ['id', 'supplier_id', 'active'];

    public entityClassName: string = SupplierContact.name;

    public constructor(public readonly _actionLogService: ActionLogService) {
        super();
    }

    public async read(data?: any): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.SUPPLIER_CATEGORY_READ, data);
    }

    public async create(data?: any): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.SUPPLIER_CATEGORY_CREATE, data);
    }

    public async update(data?: any, oldData?: any): Promise<ActionLog> {
        return super.update(
            ACTION_LOG_TYPES.SUPPLIER_CATEGORY_UPDATE,
            data,
            oldData,
        );
    }

    public async softDelete(data?: any): Promise<ActionLog> {
        return super.remove(
            ACTION_LOG_TYPES.SUPPLIER_CATEGORY_SOFT_DELETE,
            data,
        );
    }

    public async delete(data?: any): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.SUPPLIER_CATEGORY_DELETE, data);
    }
}
