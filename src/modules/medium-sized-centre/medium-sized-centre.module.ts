import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { MediumSizedCentreExistByColumnConstraint } from './constraints/medium-sized-centre.exist.by.column.constraints';
import { MediumSizedCentreExistConstraint } from './constraints/medium-sized-centre.exist.constraint';
import { MediumSizedCentreNotExistByColumnConstraint } from './constraints/medium-sized-centre.not.exist.by.column.constraints';
import { MEDIUM_SIZED_CENTRE_PROVIDERS } from './dto/provider/medium-sized-centre.providers';
import { MediumSizedCentreResolver } from './resolver/medium-sized-centre.resolver';
import { MediumSizedCentreService } from './service/medium-sized-centre.service';
import { MediumSizedCentreLogger } from './logger/medium-sized-centre.logger';
import { HtmlToPdfModule } from 'src/libs/html-to-pdf/html-to-pdf.module';
import { MediumSizedCentreController } from './controller/medium-sized-centre.controller';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    HtmlToPdfModule,
  ],
  providers: [
    ...MEDIUM_SIZED_CENTRE_PROVIDERS,
    MediumSizedCentreService,
    MediumSizedCentreResolver,
    MediumSizedCentreExistConstraint,
    MediumSizedCentreExistByColumnConstraint,
    MediumSizedCentreNotExistByColumnConstraint,
    MediumSizedCentreLogger,
  ],
  exports: [
    MediumSizedCentreService,
  ],
  controllers: [MediumSizedCentreController],
})
export class MediumSizedCentreModule { }
