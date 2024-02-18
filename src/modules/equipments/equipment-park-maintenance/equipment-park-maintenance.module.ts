//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';

//Resolvers
import { EquipmentParkMaintenanceResolver } from './equipment-park-maintenance.resolver';

//Controllers

//Services
import { EquipmentParkMaintenanceService } from './equipment-park-maintenance.service';
import { TranslationModule } from '@/libs/translation/translation.module';

@Module({
    imports: [DatabaseModule, TranslationModule],
    providers: [
        EquipmentParkMaintenanceResolver,
        EquipmentParkMaintenanceService,
    ],
    exports: [EquipmentParkMaintenanceService],
})
export class EquipmentParkMaintenanceModule {}
