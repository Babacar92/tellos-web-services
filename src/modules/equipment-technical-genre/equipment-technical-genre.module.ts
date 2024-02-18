import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentTechnicalGenreExistByColumnConstraint } from './constraints/equipment-technical-genre.exist.by.column.constraints';
import { EquipmentTechnicalGenreExistConstraint } from './constraints/equipment-technical-genre.exist.constraint';
import { EquipmentTechnicalGenreNotExistByColumnConstraint } from './constraints/equipment-technical-genre.not.exist.by.column.constraints';
import { EquipmentTechnicalGenreResolver } from './equipment-technical-genre.resolver';
import { EquipmentTechnicalGenreService } from './equipment-technical-genre.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { EquipmentTechnicalGenreLogger } from './logger/equipment-technical-genre.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    EquipmentTechnicalGenreService,
    EquipmentTechnicalGenreResolver,
    EquipmentTechnicalGenreExistConstraint,
    EquipmentTechnicalGenreExistByColumnConstraint,
    EquipmentTechnicalGenreNotExistByColumnConstraint,
    EquipmentTechnicalGenreLogger,
  ],
  exports: [
    EquipmentTechnicalGenreService,
  ],
})
export class EquipmentTechnicalGenreModule { }
