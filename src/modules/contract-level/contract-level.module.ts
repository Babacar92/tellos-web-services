import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractLevelExistByColumnConstraint } from './constraints/contract-level.exist.by.column.constraints';
import { ContractLevelExistConstraint } from './constraints/contract-level.exist.constraint';
import { ContractLevelNotExistByColumnConstraint } from './constraints/contract-level.not.exist.by.column.constraints';
import { CONTRACT_LEVEL_PROVIDERS } from './dto/provider/contract-level.providers';
import { ContractLevelResolver } from './resolver/contract-level.resolver';
import { ContractLevelService } from './service/contract-level.service';
import { ContractLevelLogger } from './logger/contract-level.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ContractLevelController } from './controller/contract-level.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...CONTRACT_LEVEL_PROVIDERS,
    ContractLevelService,
    ContractLevelResolver,
    ContractLevelExistConstraint,
    ContractLevelExistByColumnConstraint,
    ContractLevelNotExistByColumnConstraint,
    ContractLevelLogger,
  ],
  exports: [
    ContractLevelService,
  ],
  controllers: [ContractLevelController],
})
export class ContractLevelModule { }
