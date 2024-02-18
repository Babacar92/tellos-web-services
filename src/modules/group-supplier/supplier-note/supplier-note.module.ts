import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../../action-log/action-log.module';
import { SupplierNoteExistByColumnConstraint } from './constraints/supplier-note.exist.by.column.constraints';
import { SupplierNoteExistConstraint } from './constraints/supplier-note.exist.constraint';
import { SupplierNoteNotExistByColumnConstraint } from './constraints/supplier-note.not.exist.by.column.constraints';
import { SupplierNoteResolver } from './supplier-note.resolver';
import { SupplierNoteService } from './supplier-note.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { SupplierModule } from '../supplier/supplier.module';
import { SupplierNoteLogger } from './logger/supplier-note.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    SupplierModule,
  ],
  providers: [
    SupplierNoteService,
    SupplierNoteResolver,
    SupplierNoteExistConstraint,
    SupplierNoteExistByColumnConstraint,
    SupplierNoteNotExistByColumnConstraint,
    SupplierNoteLogger,
  ],
  exports: [
    SupplierNoteService,
  ],
})
export class SupplierNoteModule { }
