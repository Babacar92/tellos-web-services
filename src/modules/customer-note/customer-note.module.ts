import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { CustomerNoteExistByColumnConstraint } from './constraints/customer-note.exist.by.column.constraints';
import { CustomerNoteExistConstraint } from './constraints/customer-note.exist.constraint';
import { CustomerNoteNotExistByColumnConstraint } from './constraints/customer-note.not.exist.by.column.constraints';
import { CUSTOMER_NOTE_PROVIDERS } from './dto/provider/customer-note.providers';
import { CustomerNoteResolver } from './resolver/customer-note.resolver';
import { CustomerNoteService } from './service/customer-note.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { CustomerModule } from '../customer/customer.module';
import { CustomerNoteLogger } from './logger/customer-note.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    CustomerModule,
  ],
  providers: [
    ...CUSTOMER_NOTE_PROVIDERS,
    CustomerNoteService,
    CustomerNoteResolver,
    CustomerNoteExistConstraint,
    CustomerNoteExistByColumnConstraint,
    CustomerNoteNotExistByColumnConstraint,
    CustomerNoteLogger,
  ],
  exports: [
    CustomerNoteService,
  ],
})
export class CustomerNoteModule { }
