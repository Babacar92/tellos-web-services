import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { GoodExistByColumnConstraint } from './constraints/good.exist.by.column.constraints';
import { GoodExistConstraint } from './constraints/good.exist.constraint';
import { GoodNotExistByColumnConstraint } from './constraints/good.not.exist.by.column.constraints';
import { WORK_UNIT_PROVIDERS } from './good.providers';
import { GoodResolver } from './good.resolver';
import { GoodService } from './good.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { GoodLogger } from './logger/good.logger';

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        DocumentCategoryModule,
    ],
    providers: [
        ...WORK_UNIT_PROVIDERS,
        GoodService,
        GoodResolver,
        GoodExistConstraint,
        GoodExistByColumnConstraint,
        GoodNotExistByColumnConstraint,
        GoodLogger,
    ],
    exports: [GoodService],
})
export class GoodModule {}
