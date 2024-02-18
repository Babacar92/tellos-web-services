//NestJs
import { Module } from '@nestjs/common';

//Modules
import { SupplierModule } from './supplier/supplier.module';
import { SupplierLanguageCodeModule } from './supplier-language-code/supplier-language-code.module';
import { SupplierCategoryModule } from './supplier-category/supplier-category.module';
import { SupplierBillingModule } from './supplier-billing/supplier-billing.module';
import { SupplierNoteModule } from './supplier-note/supplier-note.module';
import { SupplierEvaluationModule } from './supplier-evaluation/supplier-evaluation.module';
import { SupplierAgencyModule } from './supplier-agency/supplier-agency.module';

//Communication
import { SupplierContactModule } from './supplier-contact/supplier-contact.module';

@Module({
    imports: [
        SupplierModule,
        SupplierLanguageCodeModule,
        SupplierCategoryModule,
        SupplierNoteModule,
        SupplierEvaluationModule,
        SupplierAgencyModule,
        SupplierContactModule,
        SupplierBillingModule,
    ],
    controllers: [],
    exports: [],
})
export class SupplierGroupModule {}
