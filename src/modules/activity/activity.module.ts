import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ActivityExistByColumnConstraint } from './constraints/activity.exist.by.column.constraints';
import { ActivityExistConstraint } from './constraints/activity.exist.constraint';
import { ActivityNotExistByColumnConstraint } from './constraints/activity.not.exist.by.column.constraints';
import { ACTIVITY_PROVIDERS } from './dto/provider/activity.providers';
import { ActivityResolver } from './resolver/activity.resolver';
import { ActivityService } from './service/activity.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { ActivityLogger } from './logger/activity.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    ...ACTIVITY_PROVIDERS,
    ActivityService,
    ActivityResolver,
    ActivityExistConstraint,
    ActivityExistByColumnConstraint,
    ActivityNotExistByColumnConstraint,
    ActivityLogger,
  ],
  exports: [
    ActivityService,
  ],
})
export class ActivityModule { }
