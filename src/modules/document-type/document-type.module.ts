import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { DocumentTypeExistByColumnConstraint } from './constraints/document-type.exist.by.column.constraints';
import { DocumentTypeExistConstraint } from './constraints/document-type.exist.constraint';
import { DocumentTypeNotExistByColumnConstraint } from './constraints/document-type.not.exist.by.column.constraints';
import { DOCUMENT_TYPE_PROVIDERS } from './dto/provider/document-type.providers';
import { DocumentTypeResolver } from './resolver/document-type.resolver';
import { DocumentTypeService } from './service/document-type.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { DocumentTypeLogger } from './logger/document-type.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { DocumentTypeController } from './controller/document-type.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...DOCUMENT_TYPE_PROVIDERS,
    DocumentTypeService,
    DocumentTypeResolver,
    DocumentTypeExistConstraint,
    DocumentTypeExistByColumnConstraint,
    DocumentTypeNotExistByColumnConstraint,
    DocumentTypeLogger,
  ],
  exports: [
    DocumentTypeService,
  ],
  controllers: [DocumentTypeController],
})
export class DocumentTypeModule { }
