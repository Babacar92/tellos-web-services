import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../../action-log/action-log.module';
import { SupplierBillingExistByColumnConstraint } from './constraints/supplier-billing.exist.by.column.constraints';
import { SupplierBillingExistConstraint } from './constraints/supplier-billing.exist.constraint';
import { SupplierBillingNotExistByColumnConstraint } from './constraints/supplier-billing.not.exist.by.column.constraints';
import { SupplierBillingResolver } from './supplier-billing.resolver';
import { SupplierBillingService } from './supplier-billing.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { SupplierModule } from '../supplier/supplier.module';
import { SupplierBillingLogger } from './logger/suplier-billing.logger';

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        UploadModule,
        SupplierModule,
    ],
    providers: [
        SupplierBillingService,
        SupplierBillingResolver,
        SupplierBillingExistConstraint,
        SupplierBillingExistByColumnConstraint,
        SupplierBillingNotExistByColumnConstraint,
        SupplierBillingLogger,
    ],
    exports: [SupplierBillingService],
})
export class SupplierBillingModule {}
