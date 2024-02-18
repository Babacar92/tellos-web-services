import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { JobDescriptionExistByColumnConstraint } from './constraints/job-description.exist.by.column.constraints';
import { JobDescriptionExistConstraint } from './constraints/job-description.exist.constraint';
import { JobDescriptionNotExistByColumnConstraint } from './constraints/job-description.not.exist.by.column.constraints';
import { JOB_DESCRIPTION_PROVIDERS } from './dto/provider/job-description.providers';
import { JobDescriptionResolver } from './resolver/job-description.resolver';
import { JobDescriptionService } from './service/job-description.service';
import { JobDescriptionLogger } from './logger/job-description.logger';
import { JobDescriptionController } from './controller/job-description.controller';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { UploadModule } from '@/libs/upload/upload.module';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
    UploadModule
  ],
  providers: [
    ...JOB_DESCRIPTION_PROVIDERS,
    JobDescriptionService,
    JobDescriptionResolver,
    JobDescriptionExistConstraint,
    JobDescriptionExistByColumnConstraint,
    JobDescriptionNotExistByColumnConstraint,
    JobDescriptionLogger,
  ],
  exports: [
    JobDescriptionService,
  ],
  controllers: [JobDescriptionController],
})
export class JobDescriptionModule { }
