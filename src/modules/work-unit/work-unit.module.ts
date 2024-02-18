import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { WorkUnitExistByColumnConstraint } from './constraints/work-unit.exist.by.column.constraints';
import { WorkUnitExistConstraint } from './constraints/work-unit.exist.constraint';
import { WorkUnitNotExistByColumnConstraint } from './constraints/work-unit.not.exist.by.column.constraints';
import { WORK_UNIT_PROVIDERS } from './dto/provider/work-unit.providers';
import { WorkUnitResolver } from './resolver/work-unit.resolver';
import { WorkUnitService } from './service/work-unit.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { WorkUnitLogger } from './logger/work-unit.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    ...WORK_UNIT_PROVIDERS,
    WorkUnitService,
    WorkUnitResolver,
    WorkUnitExistConstraint,
    WorkUnitExistByColumnConstraint,
    WorkUnitNotExistByColumnConstraint,
    WorkUnitLogger,
  ],
  exports: [
    WorkUnitService,
  ],
})
export class WorkUnitModule { }
