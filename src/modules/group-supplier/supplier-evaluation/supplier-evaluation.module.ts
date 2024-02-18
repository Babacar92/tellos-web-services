import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../../action-log/action-log.module';
import { SupplierEvaluationExistByColumnConstraint } from './constraints/supplier-evaluation.exist.by.column.constraints';
import { SupplierEvaluationExistConstraint } from './constraints/supplier-evaluation.exist.constraint';
import { SupplierEvaluationNotExistByColumnConstraint } from './constraints/supplier-evaluation.not.exist.by.column.constraints';
import { SupplierEvaluationResolver } from './supplier-evaluation.resolver';
import { SupplierEvaluationService } from './supplier-evaluation.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { SupplierModule } from '../supplier/supplier.module';
import { SupplierEvaluationLogger } from './logger/supplier-evaluation.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    SupplierModule,
  ],
  providers: [
    SupplierEvaluationService,
    SupplierEvaluationResolver,
    SupplierEvaluationExistConstraint,
    SupplierEvaluationExistByColumnConstraint,
    SupplierEvaluationNotExistByColumnConstraint,
    SupplierEvaluationLogger,
  ],
  exports: [
    SupplierEvaluationService,
  ],
})
export class SupplierEvaluationModule { }
