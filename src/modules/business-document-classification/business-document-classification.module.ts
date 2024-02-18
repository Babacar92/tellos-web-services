import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessDocumentClassificationExistByColumnConstraint } from './constraints/business-document-classification.exist.by.column.constraints';
import { BusinessDocumentClassificationExistConstraint } from './constraints/business-document-classification.exist.constraint';
import { BusinessDocumentClassificationNotExistByColumnConstraint } from './constraints/business-document-classification.not.exist.by.column.constraints';
import { BUSINESS_DOCUMENT_CLASSIFICATION_PROVIDERS } from './dto/provider/business-document-classification.providers';
import { BusinessDocumentClassificationResolver } from './resolver/business-document-classification.resolver';
import { BusinessDocumentClassificationService } from './service/business-document-classification.service';
import { BusinessDocumentClassificationLogger } from './logger/business-document-classification.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessDocumentClassificationController } from './controller/business-document-classification.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_DOCUMENT_CLASSIFICATION_PROVIDERS,
    BusinessDocumentClassificationService,
    BusinessDocumentClassificationResolver,
    BusinessDocumentClassificationExistConstraint,
    BusinessDocumentClassificationExistByColumnConstraint,
    BusinessDocumentClassificationNotExistByColumnConstraint,
    BusinessDocumentClassificationLogger,
  ],
  exports: [
    BusinessDocumentClassificationService,
  ],
  controllers: [BusinessDocumentClassificationController],
})
export class BusinessDocumentClassificationModule { }
