import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ZoneExistByColumnConstraint } from './constraints/zone.exist.by.column.constraints';
import { ZoneExistConstraint } from './constraints/zone.exist.constraint';
import { ZoneNotExistByColumnConstraint } from './constraints/zone.not.exist.by.column.constraints';
import { ZONE_PROVIDERS } from './dto/provider/zone.providers';
import { ZoneResolver } from './resolver/zone.resolver';
import { ZoneService } from './service/zone.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { ZoneLogger } from './logger/zone.logger';

@Module({
  imports: [
    DatabaseModule,
    ActionLogModule,
    TranslationModule,
    DocumentCategoryModule,
  ],
  providers: [
    ...ZONE_PROVIDERS,
    ZoneService,
    ZoneResolver,
    ZoneExistConstraint,
    ZoneExistByColumnConstraint,
    ZoneNotExistByColumnConstraint,
    ZoneLogger,
  ],
  exports: [
    ZoneService,
  ],
})
export class ZoneModule { }
