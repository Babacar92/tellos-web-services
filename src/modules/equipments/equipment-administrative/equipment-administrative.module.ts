import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { EquipmentTheoricalHourModule } from 'src/modules/equipment-theorical-hour/equipment-theorical-hour.module';
import { EquipmentAdministrativeService } from './equipment-administrative.service';
import { EquipmentAdministrativeResolver } from './equipment-administrative.resolver';
import { EquipmentParkModule } from '../equipment-park/equipment-park.module';

@Module({
    imports: [
        DatabaseModule,
        EquipmentTheoricalHourModule,
        TranslationModule,
        EquipmentParkModule,
    ],
    providers: [
        EquipmentAdministrativeResolver,
        EquipmentAdministrativeService,
    ],
    exports: [EquipmentAdministrativeService],
})
export class EquipmentAdministrativeModule {}
