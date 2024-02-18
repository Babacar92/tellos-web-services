import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { StockPileExistByColumnConstraint } from './constraints/stock-pile.exist.by.column.constraints';
import { StockPileExistConstraint } from './constraints/stock-pile.exist.constraint';
import { StockPileNotExistByColumnConstraint } from './constraints/stock-pile.not.exist.by.column.constraints';
import { StockPileResolver } from './stock-pile.resolver';
import { StockPileService } from './stock-pile.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { StockPileLogger } from './logger/stock-pile.logger';

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        DocumentCategoryModule,
    ],
    providers: [
        StockPileService,
        StockPileResolver,
        StockPileExistConstraint,
        StockPileExistByColumnConstraint,
        StockPileNotExistByColumnConstraint,
        StockPileLogger,
    ],
    exports: [StockPileService],
})
export class StockPileModule {}
