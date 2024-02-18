import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentRateExistByColumnConstraint } from './constraints/equipment-rate.exist.by.column.constraints';
import { EquipmentRateExistConstraint } from './constraints/equipment-rate.exist.constraint';
import { EquipmentRateNotExistByColumnConstraint } from './constraints/equipment-rate.not.exist.by.column.constraints';
import { EQUIPMENT_RATE_PROVIDERS } from './dto/provider/equipment-rate.providers';
import { EquipmentRateResolver } from './resolver/equipment-rate.resolver';
import { EquipmentRateService } from './service/equipment-rate.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { EquipmentRateLogger } from './logger/equipment-rate.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule
  ],
  providers: [
    ...EQUIPMENT_RATE_PROVIDERS,
    EquipmentRateService,
    EquipmentRateResolver,
    EquipmentRateExistConstraint,
    EquipmentRateExistByColumnConstraint,
    EquipmentRateNotExistByColumnConstraint,
    EquipmentRateLogger,
  ],
  exports: [
    EquipmentRateService,
  ],
})
export class EquipmentRateModule { }
