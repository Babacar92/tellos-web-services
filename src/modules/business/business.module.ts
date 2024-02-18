import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { BusinessExistByColumnConstraint } from './constraints/business.exist.by.column.constraints';
import { BusinessExistConstraint } from './constraints/business.exist.constraint';
import { BusinessNotExistByColumnConstraint } from './constraints/business.not.exist.by.column.constraints';
import { BUSINESS_PROVIDERS } from './dto/provider/business.providers';
import { BusinessResolver } from './resolver/business.resolver';
import { BusinessService } from './service/business.service';
import { BusinessLogger } from './logger/business.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { BusinessController } from './controller/business.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...BUSINESS_PROVIDERS,
    BusinessService,
    BusinessResolver,
    BusinessExistConstraint,
    BusinessExistByColumnConstraint,
    BusinessNotExistByColumnConstraint,
    BusinessLogger,
  ],
  exports: [
    BusinessService,
  ],
  controllers: [BusinessController],
})
export class BusinessModule { }
