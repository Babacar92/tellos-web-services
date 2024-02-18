import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessMarketTypeExistByColumnConstraint } from './constraints/business-market-type.exist.by.column.constraints';
import { BusinessMarketTypeExistConstraint } from './constraints/business-market-type.exist.constraint';
import { BusinessMarketTypeNotExistByColumnConstraint } from './constraints/business-market-type.not.exist.by.column.constraints';
import { BUSINESS_MARKET_TYPE_PROVIDERS } from './dto/provider/business-market-type.providers';
import { BusinessMarketTypeResolver } from './resolver/business-market-type.resolver';
import { BusinessMarketTypeService } from './service/business-market-type.service';
import { BusinessMarketTypeLogger } from './logger/business-market-type.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessMarketTypeController } from './controller/business-market-type.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_MARKET_TYPE_PROVIDERS,
    BusinessMarketTypeService,
    BusinessMarketTypeResolver,
    BusinessMarketTypeExistConstraint,
    BusinessMarketTypeExistByColumnConstraint,
    BusinessMarketTypeNotExistByColumnConstraint,
    BusinessMarketTypeLogger,
  ],
  exports: [
    BusinessMarketTypeService,
  ],
  controllers: [BusinessMarketTypeController],
})
export class BusinessMarketTypeModule { }
