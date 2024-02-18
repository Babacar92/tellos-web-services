import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { LeaveExistByColumnConstraint } from './constraints/leave.exist.by.column.constraints';
import { LeaveExistConstraint } from './constraints/leave.exist.constraint';
import { LeaveNotExistByColumnConstraint } from './constraints/leave.not.exist.by.column.constraints';
import { LEAVE_PROVIDERS } from './dto/provider/leave.providers';
import { LeaveResolver } from './resolver/leave.resolver';
import { LeaveService } from './service/leave.service';
import { LeaveCheckStartAndEndDateConstraint } from './constraints/leave.check.start.and.end.date.constraint';
import { LeaveDistributionModule } from '../leave-distribution/leave-distribution.module';
import { LeaveLogger } from './logger/leave.logger';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    LeaveDistributionModule,
    EmployeeModule,
  ],
  providers: [
    ...LEAVE_PROVIDERS,
    LeaveService,
    LeaveResolver,
    LeaveExistConstraint,
    LeaveExistByColumnConstraint,
    LeaveNotExistByColumnConstraint,
    LeaveCheckStartAndEndDateConstraint,
    LeaveLogger,
  ],
  exports: [LeaveService],
})
export class LeaveModule {}
