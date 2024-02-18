//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';

//Resolvers
import { EquipmentParkObligationResolver } from './equipment-park-obligation.resolver';

//Controllers

//Services
import { EquipmentParkObligationService } from './equipment-park-obligation.service';
import { TranslationModule } from '@/libs/translation/translation.module';

@Module({
    imports: [DatabaseModule, TranslationModule],
    providers: [
        EquipmentParkObligationResolver,
        EquipmentParkObligationService,
    ],
    exports: [EquipmentParkObligationService],
})
export class EquipmentParkObligationModule {}
