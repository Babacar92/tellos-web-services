import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { CustomerTimelineExistByColumnConstraint } from './constraints/customer-timeline.exist.by.column.constraints';
import { CustomerTimelineExistConstraint } from './constraints/customer-timeline.exist.constraint';
import { CustomerTimelineNotExistByColumnConstraint } from './constraints/customer-timeline.not.exist.by.column.constraints';
import { CUSTOMER_TIMELINE_PROVIDERS } from './dto/provider/customer-timeline.providers';
import { CustomerTimelineResolver } from './resolver/customer-timeline.resolver';
import { CustomerTimelineService } from './service/customer-timeline.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { CustomerModule } from '../customer/customer.module';
import { CustomerTimelineCheckStartAndEndDateConstraint } from './constraints/customer-timeline.check.start.and.end.date.constraint';
import { CustomerTimelineLogger } from './logger/customer-timeline.logger';
import { CustomerTimelineController } from './controller/customer-timeline.controller';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    CustomerModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...CUSTOMER_TIMELINE_PROVIDERS,
    CustomerTimelineService,
    CustomerTimelineResolver,
    CustomerTimelineExistConstraint,
    CustomerTimelineExistByColumnConstraint,
    CustomerTimelineNotExistByColumnConstraint,
    CustomerTimelineCheckStartAndEndDateConstraint,
    CustomerTimelineLogger,
  ],
  exports: [
    CustomerTimelineService,
  ],
  controllers: [CustomerTimelineController],
})
export class CustomerTimelineModule { }
