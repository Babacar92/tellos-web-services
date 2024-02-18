import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessBudgetExistByColumnConstraint } from './constraints/business-budget.exist.by.column.constraints';
import { BusinessBudgetExistConstraint } from './constraints/business-budget.exist.constraint';
import { BusinessBudgetNotExistByColumnConstraint } from './constraints/business-budget.not.exist.by.column.constraints';
import { BUSINESS_BUDGET_PROVIDERS } from './dto/provider/business-budget.providers';
import { BusinessBudgetResolver } from './resolver/business-budget.resolver';
import { BusinessBudgetService } from './service/business-budget.service';
import { BusinessBatchStatusLogger } from './logger/business-budget.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
  ],
  providers: [
    ...BUSINESS_BUDGET_PROVIDERS,
    BusinessBudgetService,
    BusinessBudgetResolver,
    BusinessBudgetExistConstraint,
    BusinessBudgetExistByColumnConstraint,
    BusinessBudgetNotExistByColumnConstraint,
    BusinessBatchStatusLogger,
  ],
  exports: [
    BusinessBudgetService,
  ],
})
export class BusinessBudgetModule { }
