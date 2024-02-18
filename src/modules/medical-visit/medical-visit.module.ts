import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { MedicalVisitExistByColumnConstraint } from './constraints/medical-visit.exist.by.column.constraints';
import { MedicalVisitExistConstraint } from './constraints/medical-visit.exist.constraint';
import { MedicalVisitNotExistByColumnConstraint } from './constraints/medical-visit.not.exist.by.column.constraints';
import { MEDICAL_VISIT_PROVIDERS } from './dto/provider/medical-visit.providers';
import { MedicalVisitResolver } from './resolver/medical-visit.resolver';
import { MedicalVisitService } from './service/medical-visit.service';
import { EmployeeModule } from '../employee/employee.module';
import { UploadModule } from 'src/libs/upload/upload.module';
import { MedicalVisitCheckStartAndEndDateConstraint } from './constraints/medical-visit.check.start.and.end.date.constraint';
import { MedicalVisitLogger } from './logger/medical-visit.logger';
@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EmployeeModule,
    UploadModule

  ],
  providers: [
    ...MEDICAL_VISIT_PROVIDERS,
    MedicalVisitService,
    MedicalVisitResolver,
    MedicalVisitExistConstraint,
    MedicalVisitExistByColumnConstraint,
    MedicalVisitNotExistByColumnConstraint,
    MedicalVisitCheckStartAndEndDateConstraint,
    MedicalVisitLogger,
  ],
  exports: [
    MedicalVisitService,
  ],
})
export class MedicalVisitModule { }
