import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '../../../libs/logger/abstract.logger';
import { ACTION_LOG_TYPES } from '../../action-log/dto/types/actions.types.enum';
import { ActionLog } from '../../../entities/mongodb/ActionLogSchema';
import { ActionLogService } from '../../action-log/services/action-log.service';
import { ConstructionSite } from '@/entities/psql/construction-site.entity';

/**
 * The Construction site Logger
 */
@Injectable()
export class ConstructionSiteLogger extends AbstractLogger {
    public columns: string[] = ['id', 'value'];

    public entityClassName: string = ConstructionSite.name;

    public constructor(public readonly _actionLogService: ActionLogService) {
        super();
    }

    public async read(data?: any): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.CONSTRUCTION_SITE_READ, data);
    }

    public async create(data?: any): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.CONSTRUCTION_SITE_CREATE, data);
    }

    public async update(data?: any, oldData?: any): Promise<ActionLog> {
        return super.update(
            ACTION_LOG_TYPES.CONSTRUCTION_SITE_UPDATE,
            data,
            oldData,
        );
    }

    public async softDelete(data?: any): Promise<ActionLog> {
        return super.remove(
            ACTION_LOG_TYPES.CONSTRUCTION_SITE_SOFT_DELETE,
            data,
        );
    }

    public async delete(data?: any): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.CONSTRUCTION_SITE_DELETE, data);
    }
}
