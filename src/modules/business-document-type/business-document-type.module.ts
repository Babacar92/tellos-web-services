import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessDocumentTypeExistByColumnConstraint } from './constraints/business-document-type.exist.by.column.constraints';
import { BusinessDocumentTypeExistConstraint } from './constraints/business-document-type.exist.constraint';
import { BusinessDocumentTypeNotExistByColumnConstraint } from './constraints/business-document-type.not.exist.by.column.constraints';
import { BUSINESS_DOCUMENT_TYPE_PROVIDERS } from './dto/provider/business-document-type.providers';
import { BusinessDocumentTypeResolver } from './resolver/business-document-type.resolver';
import { BusinessDocumentTypeService } from './service/business-document-type.service';
import { BusinessDocumentTypeLogger } from './logger/business-document-type.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessDocumentTypeController } from './controller/business-document-type.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_DOCUMENT_TYPE_PROVIDERS,
    BusinessDocumentTypeService,
    BusinessDocumentTypeResolver,
    BusinessDocumentTypeExistConstraint,
    BusinessDocumentTypeExistByColumnConstraint,
    BusinessDocumentTypeNotExistByColumnConstraint,
    BusinessDocumentTypeLogger,
  ],
  exports: [
    BusinessDocumentTypeService,
  ],
  controllers: [BusinessDocumentTypeController],
})
export class BusinessDocumentTypeModule { }
