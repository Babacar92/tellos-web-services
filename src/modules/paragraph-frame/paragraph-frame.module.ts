import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/databases/databases.module';
import { TranslationModule } from '../../libs/translation/translation.module';
import { ParagraphFrameService } from './services/paragraph-frame.service';
import { ParagraphFrameResolver } from './resolvers/paragraph-frame.resolver';
import { ActionLogModule } from '../action-log/action-log.module';
import { PARAGRAPH_FRAME_PROVIDERS } from './dto/provider/paragraph-frame.providers';
import { ParagraphFrameExistConstraint } from './constraints/paragraph-frame.exist.constraint';
import { ParagraphFrameExistByColumnConstraint } from './constraints/paragraph-frame.exist.by.column.constraints';
import { ParagraphFrameNotExistByColumnConstraint } from './constraints/paragraph-frame.not.exist.by.column.constraints';
import { PermissionModule } from '../permission/permission.module';
import { ParagraphFrameLogger } from './logger/paragraph-frame.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ParagraphFrameController } from './controller/paragraph-frame.controller';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    DatabaseModule,
    TranslationModule,
    ActionLogModule,
    PermissionModule,
    HtmlToPdfModule,
    EmployeeModule,
  ],
  providers: [
    ...PARAGRAPH_FRAME_PROVIDERS,
    ParagraphFrameService,
    ParagraphFrameResolver,
    ParagraphFrameExistConstraint,
    ParagraphFrameExistByColumnConstraint,
    ParagraphFrameNotExistByColumnConstraint,
    ParagraphFrameLogger,
  ],
  exports: [ParagraphFrameService],
  controllers: [ParagraphFrameController],
})
export class ParagraphFrameModule {}
