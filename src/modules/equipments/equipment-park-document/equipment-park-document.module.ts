//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';

//Resolvers
import { EquipmentParkDocumentResolver } from './equipment-park-document.resolver';

//Controllers

//Services
import { EquipmentParkDocumentService } from './equipment-park-document.service';
import { EquipmentParkExistConstraint } from '../equipment-park/equipment-park.exist.constraint';
import { TranslationModule } from '@/libs/translation/translation.module';
import { EquipmentParkModule } from '../equipment-park/equipment-park.module';
import { UploadModule } from '@/libs/upload/upload.module';
import { ActionLogModule } from '@/modules/action-log/action-log.module';
import { EquipmentParkDocumentLogger } from './logger/equipment-park-document.logger';

@Module({
    imports: [DatabaseModule, ActionLogModule, TranslationModule, EquipmentParkModule, UploadModule],
    providers: [
        EquipmentParkDocumentResolver,
        EquipmentParkDocumentService,
        EquipmentParkExistConstraint,
        EquipmentParkDocumentLogger
    ],
    exports: [EquipmentParkDocumentService, EquipmentParkExistConstraint],
})
export class EquipmentParkDocumentModule {}
