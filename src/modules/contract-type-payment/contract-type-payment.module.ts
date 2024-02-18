import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContractTypePaymentExistByColumnConstraint } from './constraints/contract-type-payment.exist.by.column.constraints';
import { ContractTypePaymentExistConstraint } from './constraints/contract-type-payment.exist.constraint';
import { ContractTypePaymentNotExistByColumnConstraint } from './constraints/contract-type-payment.not.exist.by.column.constraints';
import { CONTRACT_TYPE_PAYMENT_PROVIDERS } from './dto/provider/contract-type-payment.providers';
import { ContractTypePaymentResolver } from './resolver/contract-type-payment.resolver';
import { ContractTypePaymentService } from './service/contract-type-payment.service';
import { ContractTypePaymentLogger } from './logger/contract-type-payment.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { ContractTypePaymentController } from './controller/contract-type-payment.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,

  ],
  providers: [
    ...CONTRACT_TYPE_PAYMENT_PROVIDERS,
    ContractTypePaymentService,
    ContractTypePaymentResolver,
    ContractTypePaymentExistConstraint,
    ContractTypePaymentExistByColumnConstraint,
    ContractTypePaymentNotExistByColumnConstraint,
    ContractTypePaymentLogger,
  ],
  exports: [
    ContractTypePaymentService,
  ],
  controllers: [ContractTypePaymentController],
})
export class ContractTypePaymentModule { }
