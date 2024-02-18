import { DatabaseModule } from '@/libs/databases/databases.module';
import { Module } from '@nestjs/common';
import { EquipmentTechnicalService } from './equipment-technical.service';
import { EquipmentTechnicalResolver } from './equipment-technical.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [EquipmentTechnicalService, EquipmentTechnicalResolver],
  exports: [EquipmentTechnicalService],
})
export class EquipmentTechnicalModule {}
