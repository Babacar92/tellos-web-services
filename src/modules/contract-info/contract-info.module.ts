import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractInfoExistByColumnConstraint } from './constraints/contract-info.exist.by.column.constraints';
import { ContractInfoExistConstraint } from './constraints/contract-info.exist.constraint';
import { ContractInfoNotExistByColumnConstraint } from './constraints/contract-info.not.exist.by.column.constraints';
import { CONTRACT_PROVIDERS } from './dto/provider/contract-info.providers';
import { ContractInfoResolver } from './resolver/contract-info.resolver';
import { ContractInfoService } from './service/contract-info.service';
import { ContractInfoCheckStartAndEndDateConstraint } from './constraints/contract-info.check.start.and.end.date.constraint';
import { EmployeeModule } from '../employee/employee.module';
import { ContractInfoLogger } from './logger/contract-info.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EmployeeModule,
  ],
  providers: [
    ...CONTRACT_PROVIDERS,
    ContractInfoService,
    ContractInfoResolver,
    ContractInfoExistConstraint,
    ContractInfoExistByColumnConstraint,
    ContractInfoNotExistByColumnConstraint,
    ContractInfoCheckStartAndEndDateConstraint,
    ContractInfoLogger,
  ],
  exports: [
    ContractInfoService,
  ],
})
export class ContractInfoModule { }
