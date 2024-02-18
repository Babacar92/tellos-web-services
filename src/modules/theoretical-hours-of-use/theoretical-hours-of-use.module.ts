import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { TheoreticalHoursOfUseExistByColumnConstraint } from './constraints/theoretical-hours-of-use.exist.by.column.constraints';
import { TheoreticalHoursOfUseExistConstraint } from './constraints/theoretical-hours-of-use.exist.constraint';
import { TheoreticalHoursOfUseNotExistByColumnConstraint } from './constraints/theoretical-hours-of-use.not.exist.by.column.constraints';
import { THEORETICAL_HOURS_OF_USE_PROVIDERS } from './dto/provider/theoretical-hours-of-use.providers';
import { TheoreticalHoursOfUseResolver } from './resolver/theoretical-hours-of-use.resolver';
import { TheoreticalHoursOfUseService } from './service/theoretical-hours-of-use.service';
import { TheoreticalHoursOfUseLogger } from './logger/theoretical-hours-of-use.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
  ],
  providers: [
    ...THEORETICAL_HOURS_OF_USE_PROVIDERS,
    TheoreticalHoursOfUseService,
    TheoreticalHoursOfUseResolver,
    TheoreticalHoursOfUseExistConstraint,
    TheoreticalHoursOfUseExistByColumnConstraint,
    TheoreticalHoursOfUseNotExistByColumnConstraint,
    TheoreticalHoursOfUseLogger,
  ],
  exports: [
    TheoreticalHoursOfUseService,
  ],
})
export class TheoreticalHoursOfUseModule { }
