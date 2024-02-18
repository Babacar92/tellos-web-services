import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SelectQueryBuilder } from 'typeorm';
import { EncryptionService } from '../../databases/services/encryption.service';
import { UserLoginArg } from '../dto/args/user.login.arg';
import { UserConnectedInterface } from '../dto/interfaces/user.connected.interface';
import { UserConnectedResponseInterface } from '../dto/interfaces/user.connected.response.interface';
import { UserPayloadInterface } from '../dto/interfaces/user.payload.interface';
import { dump } from '../../../utils/utils';

/**
 * Auth User service
 */
@Injectable()
export class AuthUserService {
  /**
   * @param _jwtService
   */
  public constructor(private readonly _jwtService: JwtService) {}

  /**
   * Valide an user and his password by callback
   */
  public async loginUser(
    login: UserLoginArg,
    fetchUser: (username: string) => SelectQueryBuilder<any>,
  ): Promise<UserConnectedResponseInterface> {
    const queryBuilder = fetchUser(login.username);
    const fetchedUser: UserConnectedInterface = await queryBuilder.getOne();
    if (
      fetchedUser &&
      EncryptionService.compare(login.password, fetchedUser.getPassword())
    ) {
      return this._generateAccessToken(fetchedUser, {
        expiresIn: login.rememberMe ? '5y' : '3d',
      });
    }

    return;
  }

  /**
   * Register Access Token
   * @param user
   * @param options
   * @returns
   */
  private async _generateAccessToken(
    user: UserConnectedInterface,
    options?: JwtSignOptions,
  ): Promise<UserConnectedResponseInterface> {
    const payload: UserPayloadInterface = {};

    const sub = user.getSub ? user.getSub() : undefined,
      username = user.getUsername ? user.getUsername() : undefined,
      email = user.getEmail ? user.getEmail() : undefined;
    // , roles = user.getRolesNames ? user.getRolesNames() : [],
    // permissions = user.getPermissionsNames ? user.getPermissionsNames() : []
    if (sub) payload.sub = sub;
    if (username) payload.username = username;
    if (email) payload.email = email;

    if (Object.keys(payload).length) {
      return {
        accessToken: this._jwtService.sign(payload, options),
        // roles: roles,
        // permissions: permissions,
      };
    }
  }
}
