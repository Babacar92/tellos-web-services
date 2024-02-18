import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractTypeEntryExistByColumnConstraint } from './constraints/contract-type-entry.exist.by.column.constraints';
import { ContractTypeEntryExistConstraint } from './constraints/contract-type-entry.exist.constraint';
import { ContractTypeEntryNotExistByColumnConstraint } from './constraints/contract-type-entry.not.exist.by.column.constraints';
import { CONTRACT_TYPE_ENTRY_PROVIDERS } from './dto/provider/contract-type-entry.providers';
import { ContractTypeEntryResolver } from './resolver/contract-type-entry.resolver';
import { ContractTypeEntryService } from './service/contract-type-entry.service';
import { ContractTypeEntryLogger } from './logger/contract-type-entry.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ContractTypeEntryController } from './controller/contract-type-entry.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...CONTRACT_TYPE_ENTRY_PROVIDERS,
    ContractTypeEntryService,
    ContractTypeEntryResolver,
    ContractTypeEntryExistConstraint,
    ContractTypeEntryExistByColumnConstraint,
    ContractTypeEntryNotExistByColumnConstraint,
    ContractTypeEntryLogger,
  ],
  exports: [
    ContractTypeEntryService,
  ],
  controllers: [ContractTypeEntryController],
})
export class ContractTypeEntryModule { }
