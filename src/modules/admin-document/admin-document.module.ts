import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { AdminDocumentExistByColumnConstraint } from './constraints/admin-document.exist.by.column.constraints';
import { AdminDocumentExistConstraint } from './constraints/admin-document.exist.constraint';
import { AdminDocumentNotExistByColumnConstraint } from './constraints/admin-document.not.exist.by.column.constraints';
import { ADMIN_DOCUMENT_PROVIDERS } from './dto/provider/admin-document.providers';
import { AdminDocumentResolver } from './resolver/admin-document.resolver';
import { AdminDocumentService } from './service/admin-document.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { AdminDocumentLogger } from './logger/admin-document.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { AdminDocumentController } from './controller/admin-document.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...ADMIN_DOCUMENT_PROVIDERS,
    AdminDocumentService,
    AdminDocumentResolver,
    AdminDocumentExistConstraint,
    AdminDocumentExistByColumnConstraint,
    AdminDocumentNotExistByColumnConstraint,
    AdminDocumentLogger,
  ],
  exports: [
    AdminDocumentService,
  ],
  controllers: [AdminDocumentController],
})
export class AdminDocumentModule { }
