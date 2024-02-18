import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { WorkforceRateExistByColumnConstraint } from './constraints/workforce-rate.exist.by.column.constraints';
import { WorkforceRateExistConstraint } from './constraints/workforce-rate.exist.constraint';
import { WorkforceRateNotExistByColumnConstraint } from './constraints/workforce-rate.not.exist.by.column.constraints';
import { WORKFORCE_RATE_PROVIDERS } from './dto/provider/workforce-rate.providers';
import { WorkforceRateResolver } from './resolver/workforce-rate.resolver';
import { WorkforceRateService } from './service/workforce-rate.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { WorkforceRateLogger } from './logger/workforce-rate.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule
  ],
  providers: [
    ...WORKFORCE_RATE_PROVIDERS,
    WorkforceRateService,
    WorkforceRateResolver,
    WorkforceRateExistConstraint,
    WorkforceRateExistByColumnConstraint,
    WorkforceRateNotExistByColumnConstraint,
    WorkforceRateLogger,
  ],
  exports: [
    WorkforceRateService,
  ],
})
export class WorkforceRateModule { }
