import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { CareerPathExistByColumnConstraint } from './constraints/career-path.exist.by.column.constraints';
import { CareerPathExistConstraint } from './constraints/career-path.exist.constraint';
import { CareerPathNotExistByColumnConstraint } from './constraints/career-path.not.exist.by.column.constraints';
import { CAREER_PATH_PROVIDERS } from './dto/provider/career-path.providers';
import { CareerPathResolver } from './resolver/career-path.resolver';
import { CareerPathService } from './service/career-path.service';
import { EmployeeModule } from '../employee/employee.module';
import { UploadModule } from 'src/libs/upload/upload.module';
import { CareerPathCheckStartAndEndDateConstraint } from './constraints/career-path.check.start.and.end.date.constraint';
import { CareerPathLogger } from './logger/career-path.logger';
@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    EmployeeModule,
    UploadModule

  ],
  providers: [
    ...CAREER_PATH_PROVIDERS,
    CareerPathService,
    CareerPathResolver,
    CareerPathExistConstraint,
    CareerPathExistByColumnConstraint,
    CareerPathNotExistByColumnConstraint,
    CareerPathCheckStartAndEndDateConstraint,
    CareerPathLogger,
  ],
  exports: [
    CareerPathService,
  ],
})
export class CareerPathModule { }
