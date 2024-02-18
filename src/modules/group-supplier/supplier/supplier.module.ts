//NestJs
import { Module } from '@nestjs/common';

//TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { Supplier } from '@/entities/psql/supplier.entity';

//Libs
import { DatabaseModule } from '@Libs/databases/databases.module';
import { TranslationModule } from '@Libs/translation/translation.module';
import { ActionLogModule } from '@Modules/action-log/action-log.module';

//Modules
import { SupplierCategoryModule } from '@ModuleSupplier/supplier-category/supplier-category.module';
import { SupplierLanguageCodeModule } from '@ModuleSupplier/supplier-language-code/supplier-language-code.module';
import { SupplierContactModule } from '@ModuleSupplier/supplier-contact/supplier-contact.module';

//Provider
import { SUPPLIER_PROVIDERS } from './supplier.provider';

//Resolvers
import { SupplierResolver } from './supplier.resolver';

//Controllers

//Services
import { SupplierService } from './supplier.service';

//Logger
import { SupplierLogger } from './logger/supplier.logger';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
import { NotExistByColumnConstraint } from '@/common/constraints/not-exist-by-column.constraint';

@Module({
    imports: [
        // TypeOrmModule.forFeature([Supplier]),
        DatabaseModule,
        TranslationModule,
        ActionLogModule,
        SupplierCategoryModule,
        SupplierLanguageCodeModule,
        SupplierContactModule,
    ],
    controllers: [],
    providers: [
        ...SUPPLIER_PROVIDERS,
        SupplierResolver,
        SupplierService,
        SupplierLogger,
        ExistByIdConstraint,
        NotExistByColumnConstraint
    ],

    exports: [SupplierService],
})
export class SupplierModule {}
