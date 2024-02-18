import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { LeaveDistributionExistByColumnConstraint } from './constraints/leave-distribution.exist.by.column.constraints';
import { LeaveDistributionExistConstraint } from './constraints/leave-distribution.exist.constraint';
import { LeaveDistributionNotExistByColumnConstraint } from './constraints/leave-distribution.not.exist.by.column.constraints';
import { LEAVE_DISTRIBUTION_PROVIDERS } from './dto/provider/leave-distribution.providers';
import { LeaveDistributionResolver } from './resolver/leave-distribution.resolver';
import { LeaveDistributionService } from './service/leave-distribution.service';
import { LeaveDistributionLogger } from './logger/leave-distribution.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
  ],
  providers: [
    ...LEAVE_DISTRIBUTION_PROVIDERS,
    LeaveDistributionService,
    LeaveDistributionResolver,
    LeaveDistributionExistConstraint,
    LeaveDistributionExistByColumnConstraint,
    LeaveDistributionNotExistByColumnConstraint,
    LeaveDistributionLogger,
  ],
  exports: [
    LeaveDistributionService,
  ],
})
export class LeaveDistributionModule { }
