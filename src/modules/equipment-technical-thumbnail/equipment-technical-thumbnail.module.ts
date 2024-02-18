import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentTechnicalThumbnailExistByColumnConstraint } from './constraints/equipment-technical-thumbnail.exist.by.column.constraints';
import { EquipmentTechnicalThumbnailExistConstraint } from './constraints/equipment-technical-thumbnail.exist.constraint';
import { EquipmentTechnicalThumbnailNotExistByColumnConstraint } from './constraints/equipment-technical-thumbnail.not.exist.by.column.constraints';
import { EquipmentTechnicalThumbnailResolver } from './equipment-technical-thumbnail.resolver';
import { EquipmentTechnicalThumbnailService } from './equipment-technical-thumbnail.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { EquipmentTechnicalThumbnailLogger } from './logger/equipment-technical-thumbnail.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    EquipmentTechnicalThumbnailService,
    EquipmentTechnicalThumbnailResolver,
    EquipmentTechnicalThumbnailExistConstraint,
    EquipmentTechnicalThumbnailExistByColumnConstraint,
    EquipmentTechnicalThumbnailNotExistByColumnConstraint,
    EquipmentTechnicalThumbnailLogger,
  ],
  exports: [
    EquipmentTechnicalThumbnailService,
  ],
})
export class EquipmentTechnicalThumbnailModule { }
