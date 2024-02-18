import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/databases/databases.module';
import { TokenModule } from '../token/token.module';
import { LoginIsValidTokenConstraint } from './constraints/login.is-valid.token.constraint';
import {
  LOGIN_PROVIDERS,
  LOGIN_PROVIDERS_NAMES,
} from './dto/provider/login.providers';
import { LoginService } from './service/login.service';
import { TranslationModule } from '../../libs/translation/translation.module';
import { LoginExistConstraint } from './constraints/login.exist.constraint';
import { ActionLogModule } from '../action-log/action-log.module';
import { LoginExistByColumnConstraint } from './constraints/login.exist.by.column.constraints';
import { LoginNotExistByColumnConstraint } from './constraints/login.not.exist.by.column.constraints';
import { MailerModule } from '@nestjs-modules/mailer';
import { LoginResolver } from './resolver/login.resolver';
import { AuthModule } from 'src/libs/auth/auth.module';
import { LoginUserPermissionGuard } from './guards/login.user.permission.guard';
import { LoginUserJwtHeaderStrategy } from './strategy/login.user.jwt.header.strategy';
import { LoginUserJwtqueryStrategy } from './strategy/login.user.jwt.query.strategy';
import { LoginPermissionModule } from '../login-permission/login-permission.module';
import { LoginLogger } from './logger/login.logger';
import { LoginController } from './controller/login.controller';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { EmployeeModule } from '../employee/employee.module';

/**
 * Login modul
 */
@Module({
  imports: [
    DatabaseModule,
    TranslationModule,
    TokenModule,
    MailerModule,
    AuthModule,
    ActionLogModule,
    LoginPermissionModule,
    HtmlToPdfModule,
    forwardRef(() => EmployeeModule),
  ],
  providers: [
    ...LOGIN_PROVIDERS,
    LoginResolver,
    LoginService,
    LoginExistConstraint,
    LoginExistByColumnConstraint,
    LoginNotExistByColumnConstraint,
    LoginIsValidTokenConstraint,
    LoginUserJwtHeaderStrategy,
    LoginUserJwtqueryStrategy,
    LoginLogger,
    {
      provide: LOGIN_PROVIDERS_NAMES.PERMISSION_GUARD,
      useClass: LoginUserPermissionGuard,
    },
  ],
  exports: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
