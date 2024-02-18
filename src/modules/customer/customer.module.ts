import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { CustomerExistByColumnConstraint } from './constraints/customer.exist.by.column.constraints';
import { CustomerExistConstraint } from './constraints/customer.exist.constraint';
import { CustomerNotExistByColumnConstraint } from './constraints/customer.not.exist.by.column.constraints';
import { CUSTOMER_PROVIDERS } from './dto/provider/customer.providers';
import { CustomerResolver } from './resolver/customer.resolver';
import { CustomerService } from './service/customer.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { CustomerLogger } from './logger/customer.logger';
import { CustomerController } from './controller/customer.controller';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    HtmlToPdfModule
  ],
  providers: [
    ...CUSTOMER_PROVIDERS,
    CustomerService,
    CustomerResolver,
    CustomerExistConstraint,
    CustomerExistByColumnConstraint,
    CustomerNotExistByColumnConstraint,
    CustomerLogger,
  ],
  exports: [
    CustomerService,
  ],
  controllers: [CustomerController]
})
export class CustomerModule { }
