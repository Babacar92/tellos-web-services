import { EquipmentParkPreparatorySheetService } from './equipment-park-preparatory-sheet.service';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/libs/databases/databases.module';
import { EquipmentParkPreparatorySheetResolver } from './equipment-park-preparatory-sheet.resolver';
import { TranslationModule } from '@/libs/translation/translation.module';

@Module({
    imports: [DatabaseModule, TranslationModule],
    providers: [
        EquipmentParkPreparatorySheetService,
        EquipmentParkPreparatorySheetResolver,
    ],
    exports: [EquipmentParkPreparatorySheetService],
})
export class EquipmentParkPreparatorySheetModule {}
