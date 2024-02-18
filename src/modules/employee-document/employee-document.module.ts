import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { EmployeeDocumentExistByColumnConstraint } from './constraints/employee-document.exist.by.column.constraints';
import { EmployeeDocumentExistConstraint } from './constraints/employee-document.exist.constraint';
import { EmployeeDocumentNotExistByColumnConstraint } from './constraints/employee-document.not.exist.by.column.constraints';
import { EMPLOYEE_DOCUMENT_PROVIDERS } from './dto/provider/employee-document.providers';
import { EmployeeDocumentResolver } from './resolver/employee-document.resolver';
import { EmployeeDocumentService } from './service/employee-document.service';
import { EmployeeModule } from '../employee/employee.module';
import { UploadModule } from 'src/libs/upload/upload.module';
import { DocumentTypeModule } from '../document-type/document-type.module';
import { EmployeeDocumentLogger } from './logger/employee-document.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EmployeeModule,
    DocumentTypeModule,
    UploadModule,
  ],
  providers: [
    ...EMPLOYEE_DOCUMENT_PROVIDERS,
    EmployeeDocumentService,
    EmployeeDocumentResolver,
    EmployeeDocumentExistConstraint,
    EmployeeDocumentExistByColumnConstraint,
    EmployeeDocumentNotExistByColumnConstraint,
    EmployeeDocumentLogger,
  ],
  exports: [
    EmployeeDocumentService,
  ],
})
export class EmployeeDocumentModule { }
