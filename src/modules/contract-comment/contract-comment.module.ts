import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractCommentExistByColumnConstraint } from './constraints/contract-comment.exist.by.column.constraints';
import { ContractCommentExistConstraint } from './constraints/contract-comment.exist.constraint';
import { ContractCommentNotExistByColumnConstraint } from './constraints/contract-comment.not.exist.by.column.constraints';
import { CONTRACT_COMMENT_PROVIDERS } from './dto/provider/contract-comment.providers';
import { ContractCommentResolver } from './resolver/contract-comment.resolver';
import { ContractCommentService } from './service/contract-comment.service';
import { ContractCommentLogger } from './logger/contract-comment.logger';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [DatabaseModule, ActionLogModule, TranslationModule, EmployeeModule],
  providers: [
    ...CONTRACT_COMMENT_PROVIDERS,
    ContractCommentService,
    ContractCommentResolver,
    ContractCommentExistConstraint,
    ContractCommentExistByColumnConstraint,
    ContractCommentNotExistByColumnConstraint,
    ContractCommentLogger,
  ],
  exports: [ContractCommentService],
})
export class ContractCommentModule {}
