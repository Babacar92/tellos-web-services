import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/databases/databases.module';
import { TranslationModule } from '../../libs/translation/translation.module';
import { QuickAccessService } from './services/quick-access.service';
import { QuickAccessResolver } from './resolvers/quick-access.resolver';
import { ActionLogModule } from '../action-log/action-log.module';
import { QUICK_ACCESS_PROVIDERS } from './dto/provider/quick-access.providers';
import { QuickAccessExistConstraint } from './constraints/quick-access.exist.constraint';
import { EmployeeModule } from '../employee/employee.module';
import { QuickAccessLogger } from './logger/quick-access.logger';

@Module({
  imports: [DatabaseModule, TranslationModule, EmployeeModule, ActionLogModule],
  providers: [
    ...QUICK_ACCESS_PROVIDERS,
    QuickAccessService,
    QuickAccessResolver,
    QuickAccessExistConstraint,
    QuickAccessLogger,
  ],
  exports: [QuickAccessService],
})
export class QuickAccessModule {}
