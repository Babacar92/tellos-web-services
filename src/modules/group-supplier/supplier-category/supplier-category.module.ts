import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/databases/databases.module';
import { TranslationModule } from 'src/libs/translation/translation.module';
import { ActionLogModule } from '@Modules/action-log/action-log.module';
import { SupplierCategoryExistByColumnConstraint } from './constraints/supplier-category.exist.by.column.constraints';
import { SupplierCategoryExistConstraint } from './constraints/supplier-category.exist.constraint';
import { SupplierCategoryNotExistByColumnConstraint } from './constraints/supplier-category.not.exist.by.column.constraints';
import { ZONE_PROVIDERS } from './dto/provider/supplier-category.providers';
import { SupplierCategoryResolver } from './resolver/supplier-category.resolver';
import { SupplierCategoryService } from './service/supplier-category.service';
import { DocumentCategoryModule } from '@Modules/document-category/document-category.module';
import { SupplierCategoryLogger } from './logger/supplier-category.logger';

@Module({
    imports: [
        DatabaseModule,
        ActionLogModule,
        TranslationModule,
        DocumentCategoryModule,
    ],
    providers: [
        ...ZONE_PROVIDERS,
        SupplierCategoryService,
        SupplierCategoryResolver,
        SupplierCategoryExistConstraint,
        SupplierCategoryExistByColumnConstraint,
        SupplierCategoryNotExistByColumnConstraint,
        SupplierCategoryLogger,
    ],
    exports: [SupplierCategoryService],
})
export class SupplierCategoryModule {}
