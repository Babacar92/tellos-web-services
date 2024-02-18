import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthUserService } from "./services/auth.user.service";
import { TranslationModule } from "../translation/translation.module";
import * as dotenv from 'dotenv';

dotenv.config();

const {
    JWT_SECRET,
    JWT_EXPIRE,
} = process.env;

/**
 * Module Auth
 */
@Module({
    imports: [
        TranslationModule,
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {
                expiresIn: JWT_EXPIRE,
            }
        }),
    ],
    providers: [
        AuthUserService,
    ],
    exports: [
        AuthUserService,
    ],
})
export class AuthModule { }