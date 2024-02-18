import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../../action-log/action-log.module';
import { SupplierAgencyExistByColumnConstraint } from './constraints/supplier-agency.exist.by.column.constraints';
import { SupplierAgencyExistConstraint } from './constraints/supplier-agency.exist.constraint';
import { SupplierAgencyNotExistByColumnConstraint } from './constraints/supplier-agency.not.exist.by.column.constraints';
import { SupplierAgencyResolver } from './supplier-agency.resolver';
import { SupplierAgencyService } from './supplier-agency.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { SupplierModule } from '../supplier/supplier.module';
import { SupplierAgencyLogger } from './logger/supplier-agency.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    SupplierModule,
  ],
  providers: [
    SupplierAgencyService,
    SupplierAgencyResolver,
    SupplierAgencyExistConstraint,
    SupplierAgencyExistByColumnConstraint,
    SupplierAgencyNotExistByColumnConstraint,
    SupplierAgencyLogger,
  ],
  exports: [
    SupplierAgencyService,
  ],
})
export class SupplierAgencyModule { }
