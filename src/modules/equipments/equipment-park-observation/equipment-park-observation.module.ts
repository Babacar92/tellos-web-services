//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';

//Resolvers
import { EquipmentParkObservationResolver } from './equipment-park-observation.resolver';

//Controllers

//Services
import { EquipmentParkObservationService } from './equipment-park-observation.service';
import { EquipmentParkExistConstraint } from '../equipment-park/equipment-park.exist.constraint';
import { TranslationModule } from '@/libs/translation/translation.module';
import { EquipmentParkModule } from '../equipment-park/equipment-park.module';

@Module({
    imports: [DatabaseModule, TranslationModule, EquipmentParkModule],
    providers: [
        EquipmentParkObservationResolver,
        EquipmentParkObservationService,
        EquipmentParkExistConstraint,
    ],
    exports: [EquipmentParkObservationService, EquipmentParkExistConstraint],
})
export class EquipmentParkObservationModule {}
