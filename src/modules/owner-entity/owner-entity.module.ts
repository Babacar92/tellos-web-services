import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { OwnerEntityExistByColumnConstraint } from './constraints/owner-entity.exist.by.column.constraints';
import { OwnerEntityExistConstraint } from './constraints/owner-entity.exist.constraint';
import { OwnerEntityNotExistByColumnConstraint } from './constraints/owner-entity.not.exist.by.column.constraints';
import { OwnerEntityResolver } from './owner-entity.resolver';
import { OwnerEntityService } from './owner-entity.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { OwnerEntityLogger } from './logger/owner-entity.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    OwnerEntityService,
    OwnerEntityResolver,
    OwnerEntityExistConstraint,
    OwnerEntityExistByColumnConstraint,
    OwnerEntityNotExistByColumnConstraint,
    OwnerEntityLogger,
  ],
  exports: [
    OwnerEntityService,
  ],
})
export class OwnerEntityModule { }
