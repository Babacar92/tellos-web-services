import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractExistByColumnConstraint } from './constraints/contract.exist.by.column.constraints';
import { ContractExistConstraint } from './constraints/contract.exist.constraint';
import { ContractNotExistByColumnConstraint } from './constraints/contract.not.exist.by.column.constraints';
import { CONTRACT_PROVIDERS } from './dto/provider/contract.providers';
import { ContractResolver } from './resolver/contract.resolver';
import { ContractService } from './service/contract.service';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ContractController } from './controller/contract.controller';
import { ContractLogger } from './logger/contract.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...CONTRACT_PROVIDERS,
    ContractService,
    ContractResolver,
    ContractExistConstraint,
    ContractExistByColumnConstraint,
    ContractNotExistByColumnConstraint,
    ContractLogger,
  ],
  exports: [
    ContractService,
  ],
  controllers: [ContractController],
})
export class ContractModule { }
