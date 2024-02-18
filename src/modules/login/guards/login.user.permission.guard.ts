import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
    getRequestFromGraphqlContext,
    isAllowPublic,
} from '../../../utils/guard.utils';
import { PERMISSIONS_TYPES } from '../../../types/permissions.const';
import { TranslationService } from 'src/libs/translation/service/translation.service';
import { UserPayloadInterface } from 'src/libs/auth/dto/interfaces/user.payload.interface';
import { HAS_PERMISSION_KEY } from 'src/libs/auth/decorators/user.decorators';
import { LOGIN_USER_STRATEGIES_LIST } from '../data/login.user.strategy.list';

/**
 * Jwt User Permission Guard
 */
@Injectable()
export class LoginUserPermissionGuard extends AuthGuard(
    LOGIN_USER_STRATEGIES_LIST,
) {
    /**
     * @param _reflector
     */
    public constructor(
        private readonly _reflector: Reflector,
        private readonly _TranslationService: TranslationService,
    ) {
        super();
    }

    /**
     * Check if user has guard
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check public
        if (isAllowPublic(this._reflector, context)) return true;

        // Get previous result
        const previousResult = await super.canActivate(context);

        // Get request and connected user
        const request = await this.getRequest(context);
        const user: UserPayloadInterface = await request.user;

        // Check permissions
        if (user) {
            const permissions = this._reflector.getAllAndOverride<
                PERMISSIONS_TYPES[]
            >(HAS_PERMISSION_KEY, [context.getHandler(), context.getClass()]);

            const result = permissions?.length
                ? permissions.some(
                      (permissionString) =>
                          !!user.permissions.find(
                              (aPermission) => aPermission === permissionString,
                          ),
                  )
                : true;

            if (!result) {
                throw new UnauthorizedException('Has no permission');
            }
        }

        return !!previousResult;
    }

    /**
     * Return the request
     * @param context
     * @returns
     */
    public getRequest(context: ExecutionContext) {
        return getRequestFromGraphqlContext(context);
    }

    /**
     * Handle request
     * @param err
     * @param user
     * @param info
     * @param context
     * @param status
     * @returns
     */
    public handleRequest<TUser = any>(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
        status?: any,
    ): TUser {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        return user;
    }
}
