import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessPaymentModeExistByColumnConstraint } from './constraints/business-payment-mode.exist.by.column.constraints';
import { BusinessPaymentModeExistConstraint } from './constraints/business-payment-mode.exist.constraint';
import { BusinessPaymentModeNotExistByColumnConstraint } from './constraints/business-payment-mode.not.exist.by.column.constraints';
import { BUSINESS_PAYMENT_MODE_PROVIDERS } from './dto/provider/business-payment-mode.providers';
import { BusinessPaymentModeResolver } from './resolver/business-payment-mode.resolver';
import { BusinessPaymentModeService } from './service/business-payment-mode.service';
import { BusinessPaymentModeLogger } from './logger/business-payment-mode.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessPaymentModeController } from './controller/business-payment-mode.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_PAYMENT_MODE_PROVIDERS,
    BusinessPaymentModeService,
    BusinessPaymentModeResolver,
    BusinessPaymentModeExistConstraint,
    BusinessPaymentModeExistByColumnConstraint,
    BusinessPaymentModeNotExistByColumnConstraint,
    BusinessPaymentModeLogger,
  ],
  exports: [
    BusinessPaymentModeService,
  ],
  controllers: [BusinessPaymentModeController],
})
export class BusinessPaymentModeModule { }
