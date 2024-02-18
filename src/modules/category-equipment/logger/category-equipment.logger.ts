import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '../../../libs/logger/abstract.logger';
import { CategoryEquipment } from '../../../entities/psql/CategoryEquipmentEntity';
import { ACTION_LOG_TYPES } from '../../action-log/dto/types/actions.types.enum';
import { ActionLog } from '../../../entities/mongodb/ActionLogSchema';
import { ActionLogService } from '../../action-log/services/action-log.service';

/**
 * The CategoryEquipment Logger
 */
@Injectable()
export class CategoryEquipmentLogger extends AbstractLogger {
    public columns: string[] = [
        'id',
        'code',
        'title',
        'workUnit',
        'costPrice',
        'mediumSizedCentre',
        'active',
    ];

    public entityClassName: string = CategoryEquipment.name;

    public constructor(public readonly _actionLogService: ActionLogService) {
        super();
    }

    public async read(data?: any): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.CATEGORY_EQUIPMENT_READ, data);
    }

    public async create(data?: any): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.CATEGORY_EQUIPMENT_CREATE, data);
    }

    public async update(data?: any, oldData?: any): Promise<ActionLog> {
        return super.update(
            ACTION_LOG_TYPES.CATEGORY_EQUIPMENT_UPDATE,
            data,
            oldData,
        );
    }

    public async softDelete(data?: any): Promise<ActionLog> {
        return super.remove(
            ACTION_LOG_TYPES.CATEGORY_EQUIPMENT_SOFT_DELETE,
            data,
        );
    }

    public async delete(data?: any): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CATEGORY_EQUIPMENT_DELETE, data);
    }
}
