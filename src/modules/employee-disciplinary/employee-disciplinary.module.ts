import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EmployeeDisciplinaryExistByColumnConstraint } from './constraints/employee-disciplinary.exist.by.column.constraints';
import { EmployeeDisciplinaryExistConstraint } from './constraints/employee-disciplinary.exist.constraint';
import { EmployeeDisciplinaryNotExistByColumnConstraint } from './constraints/employee-disciplinary.not.exist.by.column.constraints';
import { EMPLOYEE_DISCIPLINARY_PROVIDERS } from './dto/provider/employee-disciplinary.providers';
import { EmployeeDisciplinaryResolver } from './resolver/employee-disciplinary.resolver';
import { EmployeeDisciplinaryService } from './service/employee-disciplinary.service';
import { EmployeeModule } from '../employee/employee.module';
import { UploadModule } from 'src/libs/upload/upload.module';
import { EmployeeDisciplinaryLogger } from './logger/employee-disciplinary.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EmployeeModule,
    UploadModule

  ],
  providers: [
    ...EMPLOYEE_DISCIPLINARY_PROVIDERS,
    EmployeeDisciplinaryService,
    EmployeeDisciplinaryResolver,
    EmployeeDisciplinaryExistConstraint,
    EmployeeDisciplinaryExistByColumnConstraint,
    EmployeeDisciplinaryNotExistByColumnConstraint,
    EmployeeDisciplinaryLogger,
  ],
  exports: [
    EmployeeDisciplinaryService,
  ],
})
export class EmployeeDisciplinaryModule { }
