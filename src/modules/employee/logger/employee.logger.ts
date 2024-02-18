import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '../../../libs/logger/abstract.logger';
import { Employee } from '../../../entities/psql/EmployeeEntity';
import { ACTION_LOG_TYPES } from '../../action-log/dto/types/actions.types.enum';
import { ActionLog } from '../../../entities/mongodb/ActionLogSchema';
import { ActionLogService } from '../../action-log/services/action-log.service';

/**
 * The Employee Logger
 */
@Injectable()
export class EmployeeLogger extends AbstractLogger {
    public columns: string[] = [
        'id',
        'login',
        'entity',
        'companyDeparture',
        'picture',
        'department',
        'superior',
        'boss',
        'contractInfo',
        'number',
        'type',
        'diplome',
        'gender',
        'numberOfChildren',
        'nationality',
        'bank',
        'position',
        'rib',
        'familyStatus',
        'countryBirth',
        'title',
        'secureNumber',
        'residencePermit',
        'rpDeliveryBy',
        'rpExpirationDate',
        'emailPro',
        'phonePro',
        'phoneFixPro',
        'emailPerso',
        'phonePerso',
        'phoneFixPerso',
        'phoneShortcut',
        'internalNumber',
        'handicap',
        'lastname',
        'lastnameBis',
        'firstname',
        'birthday',
        'cityBirth',
        'address',
        'postcode',
        'city',
        'country',
        'active',
    ];

    public entityClassName: string = Employee.name;

    public constructor(public readonly _actionLogService: ActionLogService) {
        super();
    }

    public async read(data?: any): Promise<ActionLog> {
        return super.read(ACTION_LOG_TYPES.EMPLOYEE_READ, data);
    }

    public async create(data?: any): Promise<ActionLog> {
        return super.create(ACTION_LOG_TYPES.EMPLOYEE_CREATE, data);
    }

    public async update(data?: any, oldData?: any): Promise<ActionLog> {
        return super.update(ACTION_LOG_TYPES.EMPLOYEE_UPDATE, data, oldData);
    }

    public async softDelete(data?: any): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.EMPLOYEE_SOFT_DELETE, data);
    }

    public async delete(data?: any): Promise<ActionLog> {
        return super.remove(ACTION_LOG_TYPES.EMPLOYEE_DELETE, data);
    }
}
