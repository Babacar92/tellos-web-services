import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '../../../libs/logger/abstract.logger';
import { EquipmentTechnicalGenre } from '../../../entities/psql/equipment-technical-genre.entity';
import { ACTION_LOG_TYPES } from '../../action-log/dto/types/actions.types.enum';
import { ActionLog } from '../../../entities/mongodb/ActionLogSchema';
import { ActionLogService } from '../../action-log/services/action-log.service';

/**
 * The EquipmentTechnicalGenre Logger
 */
@Injectable()
export class EquipmentTechnicalGenreLogger extends AbstractLogger {
  public columns: string[] = ['id', 'name', 'active'];

  public entityClassName: string = EquipmentTechnicalGenre.name;

  public constructor(public readonly _actionLogService: ActionLogService) {
    super();
  }

  public async read(data?: any): Promise<ActionLog> {
    return super.read(ACTION_LOG_TYPES.EQUIPMENT_TECHNICAL_GENRE_READ, data);
  }

  public async create(data?: any): Promise<ActionLog> {
    return super.create(ACTION_LOG_TYPES.EQUIPMENT_TECHNICAL_GENRE_CREATE, data);
  }

  public async update(data?: any, oldData?: any): Promise<ActionLog> {
    return super.update(ACTION_LOG_TYPES.EQUIPMENT_TECHNICAL_GENRE_UPDATE, data, oldData);
  }

  public async softDelete(data?: any): Promise<ActionLog> {
    return super.remove(ACTION_LOG_TYPES.EQUIPMENT_TECHNICAL_GENRE_SOFT_DELETE, data);
  }

  public async delete(data?: any): Promise<ActionLog> {
    return super.remove(ACTION_LOG_TYPES.EQUIPMENT_TECHNICAL_GENRE_DELETE, data);
  }
}
