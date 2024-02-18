import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { DocumentCategoryExistByColumnConstraint } from './constraints/document-category.exist.by.column.constraints';
import { DocumentCategoryExistConstraint } from './constraints/document-category.exist.constraint';
import { DocumentCategoryNotExistByColumnConstraint } from './constraints/document-category.not.exist.by.column.constraints';
import { DOCUMENT_CATEGORY_PROVIDERS } from './dto/provider/document-category.providers';
import { DocumentCategoryResolver } from './resolver/document-category.resolver';
import { DocumentCategoryService } from './service/document-category.service';
import { DocumentCategoryLogger } from './logger/document-category.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { DocumentCategoryController } from './controller/document-category.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...DOCUMENT_CATEGORY_PROVIDERS,
    DocumentCategoryService,
    DocumentCategoryResolver,
    DocumentCategoryExistConstraint,
    DocumentCategoryExistByColumnConstraint,
    DocumentCategoryNotExistByColumnConstraint,
    DocumentCategoryLogger,
  ],
  exports: [
    DocumentCategoryService,
  ],
  controllers: [DocumentCategoryController],
})
export class DocumentCategoryModule { }
