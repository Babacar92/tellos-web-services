import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { LoginPermissionExistByColumnConstraint } from './constraints/login-permission.exist.by.column.constraints';
import { LoginPermissionExistConstraint } from './constraints/login-permission.exist.constraint';
import { LoginPermissionNotExistByColumnConstraint } from './constraints/login-permission.not.exist.by.column.constraints';
import { LOGIN_PERMISSION_PROVIDERS } from './dto/provider/login-permission.providers';
import { LoginPermissionResolver } from './resolver/login-permission.resolver';
import { LoginPermissionService } from './service/login-permission.service';
import { LoginPermissionLogger } from './logger/login-permission.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
  ],
  providers: [
    ...LOGIN_PERMISSION_PROVIDERS,
    LoginPermissionService,
    LoginPermissionResolver,
    LoginPermissionExistConstraint,
    LoginPermissionExistByColumnConstraint,
    LoginPermissionNotExistByColumnConstraint,
    LoginPermissionLogger,
  ],
  exports: [
    LoginPermissionService,
  ],
})
export class LoginPermissionModule { }
