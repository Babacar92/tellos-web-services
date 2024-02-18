import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractApprenticeExistByColumnConstraint } from './constraints/contract-apprentice.exist.by.column.constraints';
import { ContractApprenticeExistConstraint } from './constraints/contract-apprentice.exist.constraint';
import { ContractApprenticeNotExistByColumnConstraint } from './constraints/contract-apprentice.not.exist.by.column.constraints';
import { CONTRACT_APPRENTICE_PROVIDERS } from './dto/provider/contract-apprentice.providers';
import { ContractApprenticeResolver } from './resolver/contract-apprentice.resolver';
import { ContractApprenticeService } from './service/contract-apprentice.service';
import { ContractApprenticeLogger } from './logger/contract-apprentice.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ContractApprenticeController } from './controller/contract-apprentice.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...CONTRACT_APPRENTICE_PROVIDERS,
    ContractApprenticeService,
    ContractApprenticeResolver,
    ContractApprenticeExistConstraint,
    ContractApprenticeExistByColumnConstraint,
    ContractApprenticeNotExistByColumnConstraint,
    ContractApprenticeLogger,
  ],
  exports: [
    ContractApprenticeService,
  ],
  controllers: [ContractApprenticeController],
})
export class ContractApprenticeModule { }
