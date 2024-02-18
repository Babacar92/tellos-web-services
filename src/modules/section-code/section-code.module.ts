import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { SectionCodeExistByColumnConstraint } from './constraints/section-code.exist.by.column.constraints';
import { SectionCodeExistConstraint } from './constraints/section-code.exist.constraint';
import { SectionCodeNotExistByColumnConstraint } from './constraints/section-code.not.exist.by.column.constraints';
import { SECTION_CODE_PROVIDERS } from './dto/provider/section-code.providers';
import { SectionCodeResolver } from './resolver/section-code.resolver';
import { SectionCodeService } from './service/section-code.service';
import { PurchaseAccountModule } from '../purchase-account/purchase-account.module';
import { SectionCodeLogger } from './logger/section-code.logger';
import { SectionCodeController } from './controller/section-code.controller';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { SectionCodeForArticleFamilyConstraint } from './constraints/section-code.for-article-family.constraints';
import { SectionCodeForWorkforceRateConstraint } from './constraints/section-code.for.workforce.rate.constraint';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    PurchaseAccountModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...SECTION_CODE_PROVIDERS,
    SectionCodeService,
    SectionCodeResolver,
    SectionCodeExistConstraint,
    SectionCodeExistByColumnConstraint,
    SectionCodeNotExistByColumnConstraint,
    SectionCodeForArticleFamilyConstraint,
    SectionCodeForWorkforceRateConstraint,
    SectionCodeLogger,
  ],
  exports: [
    SectionCodeService,
  ],
  controllers: [SectionCodeController]
})
export class SectionCodeModule { }
