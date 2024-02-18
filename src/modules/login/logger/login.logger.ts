import { Injectable } from '@nestjs/common';
import { AbstractLogger } from '../../../libs/logger/abstract.logger';
import { LoginEntity } from '../../../entities/psql/LoginEntity';
import { ACTION_LOG_TYPES } from '../../action-log/dto/types/actions.types.enum';
import { ActionLog } from '../../../entities/mongodb/ActionLogSchema';
import { ActionLogService } from '../../action-log/services/action-log.service';

/**
 * The Login Logger
 */
@Injectable()
export class LoginLogger extends AbstractLogger {
  public columns: string[] = [
    'id',
    'employee',
    'firstname',
    'lastname',
    'isExternal',
    'username',
    'active',
  ];

  public entityClassName: string = LoginEntity.name;

  public constructor(public readonly _actionLogService: ActionLogService) {
    super();
  }

  public async read(data?: any): Promise<ActionLog> {
    return super.read(ACTION_LOG_TYPES.LOGIN_READ, data);
  }

  public async create(data?: any): Promise<ActionLog> {
    return super.create(ACTION_LOG_TYPES.LOGIN_CREATE, data);
  }

  public async update(data?: any, oldData?: any): Promise<ActionLog> {
    return super.update(ACTION_LOG_TYPES.LOGIN_UPDATE, data, oldData);
  }

  public async softDelete(data?: any): Promise<ActionLog> {
    return super.remove(ACTION_LOG_TYPES.LOGIN_SOFT_DELETE, data);
  }

  public async delete(data?: any): Promise<ActionLog> {
    return super.remove(ACTION_LOG_TYPES.LOGIN_DELETE, data);
  }

  public async login(login: LoginEntity): Promise<ActionLog> {
    this.setUser({
      sub: login.id,
    });

    return super._saveLogData(ACTION_LOG_TYPES.LOGIN_LOGIN, login);
  }

  public async recoverPassword(login: LoginEntity): Promise<ActionLog> {
    this.setUser({
      sub: login.id,
    });

    return super._saveLogData(ACTION_LOG_TYPES.LOGIN_RECOVER_PASSWORD, login);
  }

  public async resetPassword(login: LoginEntity): Promise<ActionLog> {
    this.setUser({
      sub: login.id,
    });

    return super._saveLogData(ACTION_LOG_TYPES.LOGIN_RESET_PASSWORD, login);
  }
}
