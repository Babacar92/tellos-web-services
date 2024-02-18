import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { RegulationCodeExistByColumnConstraint } from './constraints/regulation-code.exist.by.column.constraints';
import { RegulationCodeExistConstraint } from './constraints/regulation-code.exist.constraint';
import { RegulationCodeNotExistByColumnConstraint } from './constraints/regulation-code.not.exist.by.column.constraints';
import { REGULATION_CODE_PROVIDERS } from './dto/provider/regulation-code.providers';
import { RegulationCodeResolver } from './resolver/regulation-code.resolver';
import { RegulationCodeService } from './service/regulation-code.service';
import { RegulationCodeLogger } from './logger/regulation-code.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { RegulationCodeController } from './controller/regulation-code.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,

  ],
  providers: [
    ...REGULATION_CODE_PROVIDERS,
    RegulationCodeService,
    RegulationCodeResolver,
    RegulationCodeExistConstraint,
    RegulationCodeExistByColumnConstraint,
    RegulationCodeNotExistByColumnConstraint,
    RegulationCodeLogger,
  ],
  exports: [
    RegulationCodeService,
  ],
  controllers: [RegulationCodeController],
})
export class RegulationCodeModule { }
