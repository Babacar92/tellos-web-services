import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { LeavePeriodExistByColumnConstraint } from './constraints/leave-period.exist.by.column.constraints';
import { LeavePeriodExistConstraint } from './constraints/leave-period.exist.constraint';
import { LeavePeriodNotExistByColumnConstraint } from './constraints/leave-period.not.exist.by.column.constraints';
import { LEAVE_PERIOD_PROVIDERS } from './dto/provider/leave-period.providers';
import { LeavePeriodResolver } from './resolver/leave-period.resolver';
import { LeavePeriodService } from './service/leave-period.service';
import { LeavePeriodLogger } from './logger/leave-period.logger';
import { LeavePeriodCheckDateFromAndDateToConstraint } from './constraints/leave-period.check.date.from.and.date.to.constraint';

@Module({
  imports: [DatabaseModule, ActionLogModule, TranslationModule],
  providers: [
    ...LEAVE_PERIOD_PROVIDERS,
    LeavePeriodService,
    LeavePeriodResolver,
    LeavePeriodExistConstraint,
    LeavePeriodExistByColumnConstraint,
    LeavePeriodNotExistByColumnConstraint,
    LeavePeriodCheckDateFromAndDateToConstraint,
    LeavePeriodLogger,
  ],
  exports: [LeavePeriodService],
})
export class LeavePeriodModule {}
