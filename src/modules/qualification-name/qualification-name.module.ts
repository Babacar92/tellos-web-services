import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { QualificationNameExistByColumnConstraint } from './constraints/qualification-name.exist.by.column.constraints';
import { QualificationNameExistConstraint } from './constraints/qualification-name.exist.constraint';
import { QualificationNameNotExistByColumnConstraint } from './constraints/qualification-name.not.exist.by.column.constraints';
import { QUALIFICATION_NAME_PROVIDERS } from './dto/provider/qualification-name.providers';
import { QualificationNameResolver } from './resolver/qualification-name.resolver';
import { QualificationNameService } from './service/qualification-name.service';
import { QualificationNameLogger } from './logger/qualification-name.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { QualificationNameController } from './controller/qualification-name.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...QUALIFICATION_NAME_PROVIDERS,
    QualificationNameService,
    QualificationNameResolver,
    QualificationNameExistConstraint,
    QualificationNameExistByColumnConstraint,
    QualificationNameNotExistByColumnConstraint,
    QualificationNameLogger,
  ],
  exports: [
    QualificationNameService,
  ],
  controllers: [QualificationNameController],
})
export class QualificationNameModule { }
