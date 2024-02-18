import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessTenderTypeExistByColumnConstraint } from './constraints/business-tender-type.exist.by.column.constraints';
import { BusinessTenderTypeExistConstraint } from './constraints/business-tender-type.exist.constraint';
import { BusinessTenderTypeNotExistByColumnConstraint } from './constraints/business-tender-type.not.exist.by.column.constraints';
import { BUSINESS_TENDER_TYPE_PROVIDERS } from './dto/provider/business-tender-type.providers';
import { BusinessTenderTypeResolver } from './resolver/business-tender-type.resolver';
import { BusinessTenderTypeService } from './service/business-tender-type.service';
import { BusinessTenderTypeLogger } from './logger/business-tender-type.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessTenderTypeController } from './controller/business-tender-type.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_TENDER_TYPE_PROVIDERS,
    BusinessTenderTypeService,
    BusinessTenderTypeResolver,
    BusinessTenderTypeExistConstraint,
    BusinessTenderTypeExistByColumnConstraint,
    BusinessTenderTypeNotExistByColumnConstraint,
    BusinessTenderTypeLogger,
  ],
  exports: [
    BusinessTenderTypeService,
  ],
  controllers: [BusinessTenderTypeController],
})
export class BusinessTenderTypeModule { }
