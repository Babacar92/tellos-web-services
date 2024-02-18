import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/databases/databases.module';
import { TranslationModule } from '../../libs/translation/translation.module';
import { PermissionService } from './services/permission.service';
import { PermissionResolver } from './resolvers/permission.resolver';
import { ActionLogModule } from '../action-log/action-log.module';
import { PERMISSION_PROVIDERS } from './dto/provider/permission.providers';
import { PermissionExistConstraint } from './constraints/permission.exist.constraint';
import { PermissionExistByColumnConstraint } from './constraints/permission.exist.by.column.constraints';
import { PermissionNotExistByColumnConstraint } from './constraints/permission.not.exist.by.column.constraints';

@Module({
    imports: [
        DatabaseModule,
        TranslationModule,
        ActionLogModule,
    ],
    providers: [
        ...PERMISSION_PROVIDERS,
        PermissionService,
        PermissionResolver,
        PermissionExistConstraint,
        PermissionExistByColumnConstraint,
        PermissionNotExistByColumnConstraint,
    ],
    exports: [
        PermissionService,
    ],
})
export class PermissionModule { }
