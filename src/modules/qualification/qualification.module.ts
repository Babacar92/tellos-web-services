import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { UploadModule } from 'src/libs/upload/upload.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { DepartmentModule } from '../department/department.module';
import { EmployeeModule } from '../employee/employee.module';
import { EntityModule } from '../entity/entity.module';
import { QualificationNameModule } from '../qualification-name/qualification-name.module';
import { QualificationTypeModule } from '../qualification-type/qualification-type.module';
import { QualificationExistByColumnConstraint } from './constraints/qualification.exist.by.column.constraints';
import { QualificationExistConstraint } from './constraints/qualification.exist.constraint';
import { QualificationNotExistByColumnConstraint } from './constraints/qualification.not.exist.by.column.constraints';
import { QUALIFICATION_PROVIDERS } from './dto/provider/qualification.providers';
import { QualificationResolver } from './resolver/qualification.resolver';
import { QualificationService } from './service/qualification.service';
import { QualificationLogger } from './logger/qualification.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { QualificationController } from './controller/qualification.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EntityModule,
    DepartmentModule,
    EmployeeModule,
    QualificationTypeModule,
    QualificationNameModule,
    UploadModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...QUALIFICATION_PROVIDERS,
    QualificationService,
    QualificationResolver,
    QualificationExistConstraint,
    QualificationExistByColumnConstraint,
    QualificationNotExistByColumnConstraint,
    QualificationLogger,
  ],
  exports: [
    QualificationService,
  ],
  controllers: [QualificationController],
})
export class QualificationModule { }
