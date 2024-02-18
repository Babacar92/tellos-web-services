//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from '@/libs/translation/translation.module';
import { EquipmentParkModule } from '../equipment-park/equipment-park.module';

//Resolvers
import { EquipmentParkSheetResolver } from './equipment-park-sheet.resolver';

//Controllers

//Services
import { EquipmentParkSheetService } from './equipment-park-sheet.service';
import { UploadModule } from '@/libs/upload/upload.module';

@Module({
    imports: [
        DatabaseModule,
        TranslationModule,
        EquipmentParkModule,
        UploadModule,
    ],
    providers: [EquipmentParkSheetResolver, EquipmentParkSheetService],
    exports: [EquipmentParkSheetService],
})
export class EquipmentParkSheetModule {}
