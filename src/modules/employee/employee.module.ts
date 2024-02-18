import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { MailerModule } from 'src/libs/mailers/mailer.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { UploadModule } from 'src/libs/upload/upload.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { DepartmentModule } from '../department/department.module';
import { EntityModule } from '../entity/entity.module';
import { LoginModule } from '../login/login.module';
import { EmployeeExistByColumnConstraint } from './constraints/employee.exist.by.column.constraints';
import { EmployeeExistConstraint } from './constraints/employee.exist.constraint';
import { EmployeeNotExistByColumnConstraint } from './constraints/employee.not.exist.by.column.constraints';
import { EMPLOYEE_PROVIDERS } from './dto/provider/employee.providers';
import { EmployeeResolver } from './resolver/employee.resolver';
import { EmployeeService } from './service/employee.service';
import { EmployeeLogger } from './logger/employee.logger';
import { EmployeeController } from './controller/employee.controller';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    EntityModule,
    MailerModule,
    DepartmentModule,
    HtmlToPdfModule,
    forwardRef(() => LoginModule),
  ],
  providers: [
    ...EMPLOYEE_PROVIDERS,
    EmployeeService,
    EmployeeResolver,
    EmployeeExistConstraint,
    EmployeeExistByColumnConstraint,
    EmployeeNotExistByColumnConstraint,
    EmployeeLogger,
  ],
  exports: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
