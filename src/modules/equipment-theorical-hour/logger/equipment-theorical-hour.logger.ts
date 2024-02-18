import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '../../../libs/logger/abstract.logger';
import { EquipmentTheoricalHour } from '../../../entities/psql/equipment-theorical-hour.entity';
import { ACTION_LOG_TYPES } from '../../action-log/dto/types/actions.types.enum';
import { ActionLog } from '../../../entities/mongodb/ActionLogSchema';
import { ActionLogService } from '../../action-log/services/action-log.service';

/**
 * The EquipmentTheoricalHour Logger
 */
@Injectable()
export class EquipmentTheoricalHourLogger extends AbstractLogger {
  public columns: string[] = ['id', 'value'];

  public entityClassName: string = EquipmentTheoricalHour.name;

  public constructor(public readonly _actionLogService: ActionLogService) {
    super();
  }

  public async read(data?: any): Promise<ActionLog> {
    return super.read(ACTION_LOG_TYPES.EQUIPMENT_THEORICAL_HOUR_READ, data);
  }

  public async create(data?: any): Promise<ActionLog> {
    return super.create(ACTION_LOG_TYPES.EQUIPMENT_THEORICAL_HOUR_CREATE, data);
  }

  public async update(data?: any, oldData?: any): Promise<ActionLog> {
    return super.update(ACTION_LOG_TYPES.EQUIPMENT_THEORICAL_HOUR_UPDATE, data, oldData);
  }

  public async softDelete(data?: any): Promise<ActionLog> {
    return super.remove(ACTION_LOG_TYPES.EQUIPMENT_THEORICAL_HOUR_SOFT_DELETE, data);
  }

  public async delete(data?: any): Promise<ActionLog> {
    return super.remove(ACTION_LOG_TYPES.EQUIPMENT_THEORICAL_HOUR_DELETE, data);
  }
}
