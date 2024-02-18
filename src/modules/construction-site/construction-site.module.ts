import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ConstructionSiteExistByColumnConstraint } from './constraints/construction-site.exist.by.column.constraints';
import { ConstructionSiteExistConstraint } from './constraints/construction-site.exist.constraint';
import { ConstructionSiteNotExistByColumnConstraint } from './constraints/construction-site.not.exist.by.column.constraints';
import { ContructionSiteResolver } from './construction-site.resolver';
import { ConstructionSiteService } from './construction-site.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { ConstructionSiteLogger } from './logger/construction-site.logger';

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        DocumentCategoryModule,
    ],
    providers: [
        ConstructionSiteService,
        ContructionSiteResolver,
        ConstructionSiteExistConstraint,
        ConstructionSiteExistByColumnConstraint,
        ConstructionSiteNotExistByColumnConstraint,
        ConstructionSiteLogger,
    ],
    exports: [ConstructionSiteService],
})
export class ConstructionSiteModule {}
