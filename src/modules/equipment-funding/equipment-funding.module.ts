import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentFundingExistByColumnConstraint } from './constraints/equipment-funding.exist.by.column.constraints';
import { EquipmentFundingExistConstraint } from './constraints/equipment-funding.exist.constraint';
import { EquipmentFundingNotExistByColumnConstraint } from './constraints/equipment-funding.not.exist.by.column.constraints';
import { EquipmentFundingResolver } from './equipment-funding.resolver';
import { EquipmentFundingService } from './equipment-funding.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { EquipmentFundingLogger } from './logger/equipment-funding.logger';

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        DocumentCategoryModule,
    ],
    providers: [
        EquipmentFundingService,
        EquipmentFundingResolver,
        EquipmentFundingExistConstraint,
        EquipmentFundingExistByColumnConstraint,
        EquipmentFundingNotExistByColumnConstraint,
        EquipmentFundingLogger,
    ],
    exports: [EquipmentFundingService],
})
export class EquipmentFundingModule {}
