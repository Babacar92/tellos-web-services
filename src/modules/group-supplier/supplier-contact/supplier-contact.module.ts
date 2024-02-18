//NestJs
import { Module } from '@nestjs/common';

//TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm';

//Entities
import { SupplierContact } from '@/entities/psql/supplier-contact.entity';

//Libs
import { DatabaseModule } from '@Libs/databases/databases.module';
import { TranslationModule } from '@Libs/translation/translation.module';
import { ActionLogModule } from '@Modules/action-log/action-log.module';

//Modules

//Provider
import { SUPPLIER_CONTACT_PROVIDERS } from './supplier-contact.provider';

//Resolvers
import { SupplierContactResolver } from './supplier-contact.resolver';

//Controllers

//Services
import { SupplierContactService } from './supplier-contact.service';

//Logger
import { SupplierContactLogger } from './logger/supplier-contact.logger';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
import { NotExistByColumnConstraint } from '@/common/constraints/not-exist-by-column.constraint';

@Module({
    imports: [
        // TypeOrmModule.forFeature([SupplierContact]),
        DatabaseModule,
        TranslationModule,
        ActionLogModule,
    ],
    controllers: [],
    providers: [
        ...SUPPLIER_CONTACT_PROVIDERS,
        SupplierContactResolver,
        SupplierContactService,
        SupplierContactLogger,
        ExistByIdConstraint,
        NotExistByColumnConstraint
    ],

    exports: [SupplierContactService],
})
export class SupplierContactModule {}
