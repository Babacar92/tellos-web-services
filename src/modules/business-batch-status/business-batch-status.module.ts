import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessBatchStatusExistByColumnConstraint } from './constraints/business-batch-status.exist.by.column.constraints';
import { BusinessBatchStatusExistConstraint } from './constraints/business-batch-status.exist.constraint';
import { BusinessBatchStatusNotExistByColumnConstraint } from './constraints/business-batch-status.not.exist.by.column.constraints';
import { BUSINESS_BATCH_STATUS_PROVIDERS } from './dto/provider/business-batch-status.providers';
import { BusinessBatchStatusResolver } from './resolver/business-batch-status.resolver';
import { BusinessBatchStatusService } from './service/business-batch-status.service';
import { BusinessBatchStatusLogger } from './logger/business-batch-status.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessBatchStatusController } from './controller/business-batch-status.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_BATCH_STATUS_PROVIDERS,
    BusinessBatchStatusService,
    BusinessBatchStatusResolver,
    BusinessBatchStatusExistConstraint,
    BusinessBatchStatusExistByColumnConstraint,
    BusinessBatchStatusNotExistByColumnConstraint,
    BusinessBatchStatusLogger,
  ],
  exports: [
    BusinessBatchStatusService,
  ],
  controllers: [BusinessBatchStatusController],
})
export class BusinessBatchStatusModule { }
