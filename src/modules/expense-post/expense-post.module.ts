import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ExpensePostExistByColumnConstraint } from './constraints/expense-post.exist.by.column.constraints';
import { ExpensePostExistConstraint } from './constraints/expense-post.exist.constraint';
import { ExpensePostNotExistByColumnConstraint } from './constraints/expense-post.not.exist.by.column.constraints';
import { EXPENSE_POST_PROVIDERS } from './dto/provider/expense-post.providers';
import { ExpensePostResolver } from './resolver/expense-post.resolver';
import { ExpensePostService } from './service/expense-post.service';
import { SectionCodeModule } from '../section-code/section-code.module';
import { ExpensePostLogger } from './logger/expense-post.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ExpensePostController } from './controller/expense-post.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    SectionCodeModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...EXPENSE_POST_PROVIDERS,
    ExpensePostService,
    ExpensePostResolver,
    ExpensePostExistConstraint,
    ExpensePostExistByColumnConstraint,
    ExpensePostNotExistByColumnConstraint,
    ExpensePostLogger,
  ],
  exports: [ExpensePostService],
  controllers: [ExpensePostController],
})
export class ExpensePostModule {}
