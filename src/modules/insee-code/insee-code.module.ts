import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { InseeCodeExistByColumnConstraint } from './constraints/insee-code.exist.by.column.constraints';
import { InseeCodeExistConstraint } from './constraints/insee-code.exist.constraint';
import { InseeCodeNotExistByColumnConstraint } from './constraints/insee-code.not.exist.by.column.constraints';
import { INSEE_CODE_PROVIDERS } from './dto/provider/insee-code.providers';
import { InseeCodeResolver } from './resolver/insee-code.resolver';
import { InseeCodeService } from './service/insee-code.service';
import { PurchaseAccountModule } from '../purchase-account/purchase-account.module';
import { InseeCodeLogger } from './logger/insee-code.logger';
import { InseeCodeController } from './controller/insee-code.controller';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    PurchaseAccountModule,
    HtmlToPdfModule
  ],
  providers: [
    ...INSEE_CODE_PROVIDERS,
    InseeCodeService,
    InseeCodeResolver,
    InseeCodeExistConstraint,
    InseeCodeExistByColumnConstraint,
    InseeCodeNotExistByColumnConstraint,
    InseeCodeLogger,
  ],
  exports: [
    InseeCodeService,
  ],
  controllers: [InseeCodeController]
})
export class InseeCodeModule { }
