import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessPaymentTypeExistByColumnConstraint } from './constraints/business-payment-type.exist.by.column.constraints';
import { BusinessPaymentTypeExistConstraint } from './constraints/business-payment-type.exist.constraint';
import { BusinessPaymentTypeNotExistByColumnConstraint } from './constraints/business-payment-type.not.exist.by.column.constraints';
import { BUSINESS_PAYMENT_TYPE_PROVIDERS } from './dto/provider/business-payment-type.providers';
import { BusinessPaymentTypeResolver } from './resolver/business-payment-type.resolver';
import { BusinessPaymentTypeService } from './service/business-payment-type.service';
import { BusinessPaymentTypeLogger } from './logger/business-payment-type.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessPaymentTypeController } from './controller/business-payment-type.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_PAYMENT_TYPE_PROVIDERS,
    BusinessPaymentTypeService,
    BusinessPaymentTypeResolver,
    BusinessPaymentTypeExistConstraint,
    BusinessPaymentTypeExistByColumnConstraint,
    BusinessPaymentTypeNotExistByColumnConstraint,
    BusinessPaymentTypeLogger,
  ],
  exports: [
    BusinessPaymentTypeService,
  ],
  controllers: [BusinessPaymentTypeController],
})
export class BusinessPaymentTypeModule { }
