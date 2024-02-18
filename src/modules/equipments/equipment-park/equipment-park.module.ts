//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { EntityModule } from '../../entity/entity.module';
import { EquipmentAssignmentModule } from '../equipment-assignment/equipment-assignment.module';
import { UploadModule } from 'src/libs/upload/upload.module';

//Resolvers
import { EquipmentParkResolver } from './equipment-park.resolver';

//Controllers

//Services
import { EquipmentParkService } from './equipment-park.service';

//Constraints
import { EquipmentParkExistConstraint } from './equipment-park.exist.constraint';

@Module({
    imports: [
        TranslationModule,
        DatabaseModule,
        EntityModule,
        UploadModule,
        EquipmentAssignmentModule,
    ],
    providers: [
        EquipmentParkResolver,
        EquipmentParkService,
        EquipmentParkExistConstraint,
    ],
    exports: [EquipmentParkService, EquipmentParkExistConstraint],
})
export class EquipmentParkModule {}
