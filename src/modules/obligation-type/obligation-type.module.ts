import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ObligationTypeExistByColumnConstraint } from './constraints/obligation-type.exist.by.column.constraints';
import { ObligationTypeExistConstraint } from './constraints/obligation-type.exist.constraint';
import { ObligationTypeNotExistByColumnConstraint } from './constraints/equipment-funding.not.exist.by.column.constraints';
import { ObligationTypeResolver } from './obligation-type.resolver';
import { ObligationTypeService } from './obligation-type.service';
import { DocumentCategoryModule } from '../document-category/document-category.module';
import { ObligationTypeLogger } from './logger/obligation-type.logger';

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        DocumentCategoryModule,
    ],
    providers: [
        ObligationTypeService,
        ObligationTypeResolver,
        ObligationTypeExistConstraint,
        ObligationTypeExistByColumnConstraint,
        ObligationTypeNotExistByColumnConstraint,
        ObligationTypeLogger,
    ],
    exports: [ObligationTypeService],
})
export class ObligationTypeModule {}
