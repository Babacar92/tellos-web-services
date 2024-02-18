import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessBatchExistByColumnConstraint } from './constraints/business-batch.exist.by.column.constraints';
import { BusinessBatchExistConstraint } from './constraints/business-batch.exist.constraint';
import { BusinessBatchNotExistByColumnConstraint } from './constraints/business-batch.not.exist.by.column.constraints';
import { BUSINESS_BATCH_PROVIDERS } from './dto/provider/business-batch.providers';
import { BusinessBatchResolver } from './resolver/business-batch.resolver';
import { BusinessBatchService } from './service/business-batch.service';
import { BusinessBatchLogger } from './logger/business-batch.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
  ],
  providers: [
    ...BUSINESS_BATCH_PROVIDERS,
    BusinessBatchService,
    BusinessBatchResolver,
    BusinessBatchExistConstraint,
    BusinessBatchExistByColumnConstraint,
    BusinessBatchNotExistByColumnConstraint,
    BusinessBatchLogger,
  ],
  exports: [
    BusinessBatchService,
  ],
})
export class BusinessBatchModule { }
