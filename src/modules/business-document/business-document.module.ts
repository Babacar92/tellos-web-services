import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessDocumentExistByColumnConstraint } from './constraints/business-document.exist.by.column.constraints';
import { BusinessDocumentExistConstraint } from './constraints/business-document.exist.constraint';
import { BusinessDocumentNotExistByColumnConstraint } from './constraints/business-document.not.exist.by.column.constraints';
import { BUSINESS_DOCUMENT_PROVIDERS } from './dto/provider/business-document.providers';
import { BusinessDocumentResolver } from './resolver/business-document.resolver';
import { BusinessDocumentService } from './service/business-document.service';
import { UploadModule } from '../../libs/upload/upload.module';
import { BusinessDocumentLogger } from './logger/business-document.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
  ],
  providers: [
    ...BUSINESS_DOCUMENT_PROVIDERS,
    BusinessDocumentService,
    BusinessDocumentResolver,
    BusinessDocumentExistConstraint,
    BusinessDocumentExistByColumnConstraint,
    BusinessDocumentNotExistByColumnConstraint,
    BusinessDocumentLogger,
  ],
  exports: [
    BusinessDocumentService,
  ],
})
export class BusinessDocumentModule { }
