import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentParkUnitExistByColumnConstraint } from './constraints/equipment-park-unit.exist.by.column.constraints';
import { EquipmentParkUnitExistConstraint } from './constraints/equipment-park-unit.exist.constraint';
import { EquipmentParkUnitNotExistByColumnConstraint } from './constraints/equipment-park-unit.not.exist.by.column.constraints';
import { STOCK_UNIT_PROVIDERS } from './dto/provider/equipment-park-unit.providers';
import { EquipmentParkUnitResolver } from './resolver/equipment-park-unit.resolver';
import { EquipmentParkUnitService } from './service/equipment-park-unit.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { EquipmentParkUnitLogger } from './logger/equipment-park-unit.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    ...STOCK_UNIT_PROVIDERS,
    EquipmentParkUnitService,
    EquipmentParkUnitResolver,
    EquipmentParkUnitExistConstraint,
    EquipmentParkUnitExistByColumnConstraint,
    EquipmentParkUnitNotExistByColumnConstraint,
    EquipmentParkUnitLogger,
  ],
  exports: [
    EquipmentParkUnitService,
  ],
})
export class EquipmentParkUnitModule { }
