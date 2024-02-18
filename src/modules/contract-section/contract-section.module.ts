import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractSectionExistByColumnConstraint } from './constraints/contract-section.exist.by.column.constraints';
import { ContractSectionExistConstraint } from './constraints/contract-section.exist.constraint';
import { ContractSectionNotExistByColumnConstraint } from './constraints/contract-section.not.exist.by.column.constraints';
import { CONTRACT_SECTION_PROVIDERS } from './dto/provider/contract-section.providers';
import { ContractSectionResolver } from './resolver/contract-section.resolver';
import { ContractSectionLogger } from './logger/contract-section.logger';
import { ContractSectionService } from './service/contract-section.service';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ContractSectionController } from './controller/contract-section.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...CONTRACT_SECTION_PROVIDERS,
    ContractSectionService,
    ContractSectionResolver,
    ContractSectionExistConstraint,
    ContractSectionExistByColumnConstraint,
    ContractSectionNotExistByColumnConstraint,
    ContractSectionLogger,
  ],
  exports: [
    ContractSectionService,
  ],
  controllers: [ContractSectionController],
})
export class ContractSectionModule { }
