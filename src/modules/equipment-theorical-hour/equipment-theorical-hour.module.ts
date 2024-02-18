import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentTheoricalHourExistByColumnConstraint } from './constraints/equipment-theorical-hour.exist.by.column.constraints';
import { EquipmentTheoricalHourExistConstraint } from './constraints/equipment-theorical-hour.exist.constraint';
import { EquipmentTheoricalHourNotExistByColumnConstraint } from './constraints/equipment-theorical-hour.not.exist.by.column.constraints';
import { EquipmentTheoricalHourResolver } from './equipment-theorical-hour.resolver';
import { EquipmentTheoricalHourService } from './equipment-theorical-hour.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { EquipmentTheoricalHourLogger } from './logger/equipment-theorical-hour.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    EquipmentTheoricalHourService,
    EquipmentTheoricalHourResolver,
    EquipmentTheoricalHourExistConstraint,
    EquipmentTheoricalHourExistByColumnConstraint,
    EquipmentTheoricalHourNotExistByColumnConstraint,
    EquipmentTheoricalHourLogger,
  ],
  exports: [
    EquipmentTheoricalHourService,
  ],
})
export class EquipmentTheoricalHourModule { }
