import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { AdministrativeMaterialExistByColumnConstraint } from './constraints/administrative-material.exist.by.column.constraints';
import { AdministrativeMaterialExistConstraint } from './constraints/administrative-material.exist.constraint';
import { AdministrativeMaterialNotExistByColumnConstraint } from './constraints/administrative-material.not.exist.by.column.constraints';
import { ADMINISTRATIVE_MATERIAL_PROVIDERS } from './dto/provider/administrative-material.providers';
import { AdministrativeMaterialResolver } from './resolver/administrative-material.resolver';
import { AdministrativeMaterialService } from './service/administrative-material.service';
import { AdministrativeMaterialLogger } from './logger/administrative-material.logger';
import { EmployeeModule } from '../employee/employee.module';
import { EntityModule } from '../entity/entity.module';
import { TheoreticalHoursOfUseModule } from '../theoretical-hours-of-use/theoretical-hours-of-use.module';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EmployeeModule,
    EntityModule,
    TheoreticalHoursOfUseModule
  ],
  providers: [
    ...ADMINISTRATIVE_MATERIAL_PROVIDERS,
    AdministrativeMaterialService,
    AdministrativeMaterialResolver,
    AdministrativeMaterialExistConstraint,
    AdministrativeMaterialExistByColumnConstraint,
    AdministrativeMaterialNotExistByColumnConstraint,
    AdministrativeMaterialLogger,
  ],
  exports: [
    AdministrativeMaterialService,
  ],
})
export class AdministrativeMaterialModule { }
