import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { QualificationTypeExistByColumnConstraint } from './constraints/qualification-type.exist.by.column.constraints';
import { QualificationTypeExistConstraint } from './constraints/qualification-type.exist.constraint';
import { QualificationTypeNotExistByColumnConstraint } from './constraints/qualification-type.not.exist.by.column.constraints';
import { QUALIFICATION_TYPE_PROVIDERS } from './dto/provider/qualification-type.providers';
import { QualificationTypeResolver } from './resolver/qualification-type.resolver';
import { QualificationTypeService } from './service/qualification-type.service';
import { QualificationTypeLogger } from './logger/qualification-type.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { QualificationTypeController } from './controller/qualification-type.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...QUALIFICATION_TYPE_PROVIDERS,
    QualificationTypeService,
    QualificationTypeResolver,
    QualificationTypeExistConstraint,
    QualificationTypeExistByColumnConstraint,
    QualificationTypeNotExistByColumnConstraint,
    QualificationTypeLogger,
  ],
  exports: [
    QualificationTypeService,
  ],
  controllers: [QualificationTypeController],
})
export class QualificationTypeModule { }
