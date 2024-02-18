import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../libs/databases/databases.module';
import { TranslationModule } from '../../libs/translation/translation.module';
import { ArticleFamilyService } from './services/article-family.service';
import { ArticleFamilyResolver } from './resolvers/article-family.resolver';
import { ActionLogModule } from '../action-log/action-log.module';
import { ARTICLE_FAMILY_PROVIDERS } from './dto/provider/article-family.providers';
import { ArticleFamilyExistConstraint } from './constraints/article-family.exist.constraint';
import { EmployeeModule } from '../employee/employee.module';
import { ArticleFamilyLogger } from './logger/article-family.logger';
import { ArticleFamilyIsChildOfConstraint } from './constraints/article-family.is-child-of.constraint';

@Module({
  imports: [DatabaseModule, TranslationModule, EmployeeModule, ActionLogModule],
  providers: [
    ...ARTICLE_FAMILY_PROVIDERS,
    ArticleFamilyService,
    ArticleFamilyResolver,
    ArticleFamilyExistConstraint,
    ArticleFamilyIsChildOfConstraint,
    ArticleFamilyLogger,
  ],
  exports: [ArticleFamilyService],
})
export class ArticleFamilyModule {}
