import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { GoodReferencePriceExistByColumnConstraint } from './constraints/good-reference-price.exist.by.column.constraints';
import { GoodReferencePriceExistConstraint } from './constraints/good-reference-price.exist.constraint';
import { GoodReferencePriceNotExistByColumnConstraint } from './constraints/good-reference-price.not.exist.by.column.constraints';
import { GOOD_REFERENCE_PRICE_PROVIDERS } from './dto/provider/good-reference-price.providers';
import { GoodReferencePriceResolver } from './resolver/good-reference-price.resolver';
import { GoodReferencePriceService } from './service/good-reference-price.service';
import { GoodReferencePriceLogger } from './logger/good-reference-price.logger';

@Module({
    imports: [DatabaseModule, ActionLogModule, TranslationModule],
    providers: [
        ...GOOD_REFERENCE_PRICE_PROVIDERS,
        GoodReferencePriceService,
        GoodReferencePriceResolver,
        GoodReferencePriceExistConstraint,
        GoodReferencePriceExistByColumnConstraint,
        GoodReferencePriceNotExistByColumnConstraint,
        GoodReferencePriceLogger,
    ],
    exports: [GoodReferencePriceService],
})
export class GoodReferencePriceModule {}
