import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { CustomerDocumentExistByColumnConstraint } from './constraints/customer-document.exist.by.column.constraints';
import { CustomerDocumentExistConstraint } from './constraints/customer-document.exist.constraint';
import { CustomerDocumentNotExistByColumnConstraint } from './constraints/customer-document.not.exist.by.column.constraints';
import { CUSTOMER_DOCUMENT_PROVIDERS } from './dto/provider/customer-document.providers';
import { CustomerDocumentResolver } from './resolver/customer-document.resolver';
import { CustomerDocumentService } from './service/customer-document.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { CustomerModule } from '../customer/customer.module';
import { CustomerDocumentLogger } from './logger/customer-document.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    CustomerModule,
  ],
  providers: [
    ...CUSTOMER_DOCUMENT_PROVIDERS,
    CustomerDocumentService,
    CustomerDocumentResolver,
    CustomerDocumentExistConstraint,
    CustomerDocumentExistByColumnConstraint,
    CustomerDocumentNotExistByColumnConstraint,
    CustomerDocumentLogger,
  ],
  exports: [
    CustomerDocumentService,
  ],
})
export class CustomerDocumentModule { }
