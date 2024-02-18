import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { CustomerContactExistByColumnConstraint } from './constraints/customer-contact.exist.by.column.constraints';
import { CustomerContactExistConstraint } from './constraints/customer-contact.exist.constraint';
import { CustomerContactNotExistByColumnConstraint } from './constraints/customer-contact.not.exist.by.column.constraints';
import { CUSTOMER_CONTACT_PROVIDERS } from './dto/provider/customer-contact.providers';
import { CustomerContactResolver } from './resolver/customer-contact.resolver';
import { CustomerContactService } from './service/customer-contact.service';
import { UploadModule } from 'src/libs/upload/upload.module';
import { CustomerModule } from '../customer/customer.module';
import { CustomerContactLogger } from './logger/customer-contact.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    UploadModule,
    CustomerModule,
  ],
  providers: [
    ...CUSTOMER_CONTACT_PROVIDERS,
    CustomerContactService,
    CustomerContactResolver,
    CustomerContactExistConstraint,
    CustomerContactExistByColumnConstraint,
    CustomerContactNotExistByColumnConstraint,
    CustomerContactLogger,
  ],
  exports: [
    CustomerContactService,
  ],
})
export class CustomerContactModule { }
