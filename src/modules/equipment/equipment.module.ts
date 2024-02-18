import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EquipmentExistByColumnConstraint } from './constraints/equipment.exist.by.column.constraints';
import { EquipmentExistConstraint } from './constraints/equipment.exist.constraint';
import { EquipmentNotExistByColumnConstraint } from './constraints/equipment.not.exist.by.column.constraints';
import { EQUIPMENT_PROVIDERS } from './dto/provider/equipment.providers';
import { EquipmentResolver } from './resolver/equipment.resolver';
import { EquipmentService } from './service/equipment.service';
import { EmployeeModule } from '../employee/employee.module';
import { UploadModule } from 'src/libs/upload/upload.module';
import { EquipmentLogger } from './logger/equipment.logger';
import { EquipmentCheckStartAndEndDateConstraint } from './constraints/equipment.check.start.and.end.date.constraint';
import { EquipmentCheckOrderAndDeliveryDateConstraint } from './constraints/equipment.check.order.and.delivery.date.constraint';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EmployeeModule,
    UploadModule

  ],
  providers: [
    ...EQUIPMENT_PROVIDERS,
    EquipmentService,
    EquipmentResolver,
    EquipmentExistConstraint,
    EquipmentExistByColumnConstraint,
    EquipmentNotExistByColumnConstraint,
    EquipmentCheckStartAndEndDateConstraint,
    EquipmentCheckOrderAndDeliveryDateConstraint,
    EquipmentLogger,
  ],
  exports: [
    EquipmentService,
  ],
})
export class EquipmentModule { }
