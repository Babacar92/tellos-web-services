import { Module } from '@nestjs/common';
import { EntityModule } from '../entity/entity.module';
import { DataloaderFactory } from './dataloader.factory';
import { CategoryEquipmentModule } from '../category-equipment/category-equipment.module';
import { EmployeeModule } from '../employee/employee.module';
import { EquipmentFundingModule } from '../equipment-funding/equipment-funding.module';
import { EquipmentParkModule } from '../equipments/equipment-park/equipment-park.module';
import { OwnerEntityModule } from '../owner-entity/owner-entity.module';
import { EquipmentTechnicalGenreModule } from '../equipment-technical-genre/equipment-technical-genre.module';
import { EquipmentTechnicalThumbnailModule } from '../equipment-technical-thumbnail/equipment-technical-thumbnail.module';
import { DocumentTypeModule } from '../document-type/document-type.module';
import { EquipmentParkUnitModule } from '../equipment-park-unit/equipment-park-unit.module';
import { CustomerModule } from '../customer/customer.module';
import { LoginModule } from '../login/login.module';
import { SupplierModule } from '../group-supplier/supplier/supplier.module';
import { SupplierLanguageCodeModule } from '../group-supplier/supplier-language-code/supplier-language-code.module';
import { EquipmentParkSheetModule } from '../equipments/equipment-park-sheet/equipment-park-sheet.module';
import { GoodModule } from '../good/good.module';
import { MediumSizedCentreModule } from '../medium-sized-centre/medium-sized-centre.module';
import { ObligationTypeModule } from '../obligation-type/obligation-type.module';
import { EquipmentParkDocumentModule } from '../equipments/equipment-park-document/equipment-park-document.module';
import { SupplierCategoryModule } from '../group-supplier/supplier-category/supplier-category.module';
import { SupplierNoteModule } from '../group-supplier/supplier-note/supplier-note.module';
import { ConstructionSiteModule } from '../construction-site/construction-site.module';

@Module({
    imports: [
        EntityModule,
        CategoryEquipmentModule,
        EmployeeModule,
        EquipmentParkModule,
        EquipmentFundingModule,
        OwnerEntityModule,
        EquipmentTechnicalGenreModule,
        EquipmentTechnicalThumbnailModule,
        DocumentTypeModule,
        EquipmentParkUnitModule,
        CustomerModule,
        LoginModule,
        SupplierModule,
        SupplierLanguageCodeModule,
        SupplierCategoryModule,
        EquipmentParkSheetModule,
        GoodModule,
        MediumSizedCentreModule,
        ObligationTypeModule,
        EquipmentParkDocumentModule,
        SupplierNoteModule,
        ConstructionSiteModule,
    ],
    providers: [DataloaderFactory],
    exports: [DataloaderFactory],
})
export class DataloaderModule {}
