import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from 'dotenv';
import { UserPayloadInterface } from "../../../libs/auth/dto/interfaces/user.payload.interface";
import { LOGIN_USER_STRATEGIES } from "../data/login.user.strategy.list";
import { LoginService } from "../service/login.service";

dotenv.config();

const {
    JWT_SECRET,
} = process.env;

/**
 * Jwt User Strategy
 */
@Injectable()
export class LoginUserJwtHeaderStrategy extends PassportStrategy(Strategy, LOGIN_USER_STRATEGIES.BEARER_HEADER) {

    public constructor(
        private readonly _service: LoginService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
        });
    }

    /**
     * Valide a user
     * @param payload 
     * @returns 
     */
    public async validate(payload: UserPayloadInterface): Promise<UserPayloadInterface> {
        const permissions = await this._service.findPermissions(payload);

        payload.permissions = permissions;

        return payload;
    }

}