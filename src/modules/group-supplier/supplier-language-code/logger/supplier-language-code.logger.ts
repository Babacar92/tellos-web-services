import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '@Libs/logger/abstract.logger';
import { SupplierLanguageCodeEntity } from '@Entities/SupplierLanguageCodeEntity';
import { ACTION_LOG_TYPES } from '@Modules/action-log/dto/types/actions.types.enum';
import { ActionLog } from '@/entities/mongodb/ActionLogSchema';
import { ActionLogService } from '@Modules/action-log/services/action-log.service';

/**
 * The SupplierLanguageCode Logger
 */
@Injectable()
export class SupplierLanguageCodeLogger extends AbstractLogger {
    public columns: string[] = ['id', 'name', 'active'];

    public entityClassName: string = SupplierLanguageCodeEntity.name;

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
