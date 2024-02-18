//NestJs
import { Module } from '@nestjs/common';

//TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { SupplierLanguageCodeEntity } from '@/entities/psql/SupplierLanguageCodeEntity';

//Modules
import { DatabaseModule } from '@Libs/databases/databases.module';
import { TranslationModule } from '@Libs/translation/translation.module';
import { ActionLogModule } from '@Modules/action-log/action-log.module';

//Provider
import { SUPPLIER_LANGUAGE_CODE_PROVIDERS } from './supplier-language-code.provider';

//Resolvers
import { SupplierLanguageCodeResolver } from './supplier-language-code.resolver';

//Controllers

//Services
import { SupplierLanguageCodeService } from './supplier-language-code.service';
import { SupplierLanguageCodeLogger } from './logger/supplier-language-code.logger';

@Module({
    imports: [
        // TypeOrmModule.forFeature([SupplierLanguageCodeEntity]),
        DatabaseModule,
        TranslationModule,
        ActionLogModule,
    ],
    controllers: [],
    providers: [
        ...SUPPLIER_LANGUAGE_CODE_PROVIDERS,
        SupplierLanguageCodeResolver,
        SupplierLanguageCodeService,
        SupplierLanguageCodeLogger,
    ],
    exports: [SupplierLanguageCodeService],
})
export class SupplierLanguageCodeModule {}
