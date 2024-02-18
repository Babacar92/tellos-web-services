
//NestJs
import { Module } from '@nestjs/common';

//Modules
import { DatabaseModule } from 'src/libs/databases/databases.module';

//Resolvers
import { EquipmentAssignmentResolver } from './equipment-assignment.resolver';

//Controllers

//Services
import { EquipmentAssignmentService } from './equipment-assignment.service';

@Module({
  imports: [DatabaseModule],
  providers: [EquipmentAssignmentResolver, EquipmentAssignmentService],
  exports: [EquipmentAssignmentService],
})
export class EquipmentAssignmentModule {}
