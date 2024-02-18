import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { PurchaseAccountExistByColumnConstraint } from './constraints/purchase-account.exist.by.column.constraints';
import { PurchaseAccountExistConstraint } from './constraints/purchase-account.exist.constraint';
import { PurchaseAccountNotExistByColumnConstraint } from './constraints/purchase-account.not.exist.by.column.constraints';
import { PURCHASE_ACCOUNT_PROVIDERS } from './dto/provider/purchase-account.providers';
import { PurchaseAccountResolver } from './resolver/purchase-account.resolver';
import { PurchaseAccountService } from './service/purchase-account.service';
import { PurchaseAccountLogger } from './logger/purchase-account.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
  ],
  providers: [
    ...PURCHASE_ACCOUNT_PROVIDERS,
    PurchaseAccountService,
    PurchaseAccountResolver,
    PurchaseAccountExistConstraint,
    PurchaseAccountExistByColumnConstraint,
    PurchaseAccountNotExistByColumnConstraint,
    PurchaseAccountLogger,
  ],
  exports: [
    PurchaseAccountService,
  ],
})
export class PurchaseAccountModule { }
