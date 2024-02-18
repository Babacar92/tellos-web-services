import { Injectable } from '@nestjs/common';
import { EntityService } from 'src/modules/entity/services/entity.service';
import * as Dataloader from 'dataloader';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { CategoryEquipmentService } from '../category-equipment/service/category-equipment.service';
import { EmployeeService } from '../employee/service/employee.service';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';
import { EquipmentParkService } from '../equipments/equipment-park/equipment-park.service';
import { EquipmentFundingService } from '../equipment-funding/equipment-funding.service';
import { OwnerEntityService } from '../owner-entity/owner-entity.service';
import { EquipmentFunding } from '@/entities/psql/equipment-funding.entity';
import { OwnerEntity } from 'src/entities/psql/owner-entity.entity';
import { EquipmentTechnicalGenre } from '@/entities/psql/equipment-technical-genre.entity';
import { EquipmentTechnicalGenreService } from '../equipment-technical-genre/equipment-technical-genre.service';
import { EquipmentTechnicalThumbnailService } from '../equipment-technical-thumbnail/equipment-technical-thumbnail.service';
import { EquipmentTechnicalThumbnail } from '@/entities/psql/equipment-technical-thumbnail.entity';
import { DocumentTypeEntity } from '@/entities/psql/DocumentTypeEntity';
import { DocumentTypeService } from '../document-type/service/document-type.service';
import { UploadEntity } from '@/entities/psql/UploadEntity';
import { CustomerEntity } from '@/entities/psql/CustomerEntity';
import { CustomerService } from '../customer/service/customer.service';
import { LoginService } from '../login/service/login.service';
import { Supplier } from '@/entities/psql/supplier.entity';
import { SupplierService } from '../group-supplier/supplier/supplier.service';

import { EquipmentParkSheetService } from '../equipments/equipment-park-sheet/equipment-park-sheet.service';
import { GoodService } from '../good/good.service';
import { Good } from '@Entities/good.entity';
import { MediumSizedCentreService } from '../medium-sized-centre/service/medium-sized-centre.service';
import { MediumSizedCentreEntity } from '@/entities/psql/MediumSizedCentreEntity';
import { ObligationType } from '@/entities/psql/obligation-type.entity';
import { ObligationTypeService } from '../obligation-type/obligation-type.service';
import { EquipmentParkDocumentService } from '../equipments/equipment-park-document/equipment-park-document.service';
import { LoginEntity } from '@/entities/psql/LoginEntity';
import { SupplierLanguageCodeEntity } from '@/entities/psql/SupplierLanguageCodeEntity';
import { SupplierLanguageCodeService } from '../group-supplier/supplier-language-code/supplier-language-code.service';
import { SupplierCategoryEntity } from '@/entities/psql/SupplierCategoryEntity';
import { SupplierCategoryService } from '../group-supplier/supplier-category/service/supplier-category.service';
import { SupplierNoteService } from '../group-supplier/supplier-note/supplier-note.service';
import { ConstructionSite } from '@/entities/psql/construction-site.entity';
import { ConstructionSiteService } from '../construction-site/construction-site.service';

@Injectable()
export class DataloaderFactory {
    constructor(
        private entityService: EntityService,
        private categoryEquipmentService: CategoryEquipmentService,
        private employeeService: EmployeeService,
        private equipmentParkService: EquipmentParkService,
        private equipmentFundingService: EquipmentFundingService,
        private ownerEntityService: OwnerEntityService,
        private equipmenttechnicalGenreService: EquipmentTechnicalGenreService,
        private equipmentTechnicalThumbnailService: EquipmentTechnicalThumbnailService,
        private documentTypeService: DocumentTypeService,
        private customerService: CustomerService,
        private loginService: LoginService,
        private supplierService: SupplierService,
        private supplierLanguageCodeService: SupplierLanguageCodeService,
        private supplierCategoryService: SupplierCategoryService,
        private equipmentParkSheetService: EquipmentParkSheetService,
        private goodsService: GoodService,
        private mediumSizedCenterService: MediumSizedCentreService,
        private obligationTypeService: ObligationTypeService,
        private equipmentParkDocumentService: EquipmentParkDocumentService,
        private supplierNoteService: SupplierNoteService,
        private constructionSiteService: ConstructionSiteService,
    ) {}

    loginLoader() {
        return new Dataloader<number, LoginEntity>(async (keys: number[]) => {
            return this.loginService.getAllLoginByIds(keys);
        });
    }

    entityLoader() {
        return new Dataloader<number, EntityEntity>(async (keys: number[]) => {
            return this.entityService.getAllEntitiesByIds(keys);
        });
    }

    categoryEquipmentLoader() {
        return new Dataloader<number, CategoryEquipment>(
            async (keys: number[]) => {
                return this.categoryEquipmentService.getCategoryEquipmentByIds(
                    keys,
                );
            },
        );
    }

    employeeLoader() {
        return new Dataloader<number, Employee>(async (keys: number[]) => {
            return this.employeeService.findEmployeesByIds(keys);
        });
    }

    supplierLoader() {
        return new Dataloader<number, Supplier>(async (keys: number[]) => {
            return <Supplier[]>(
                await this.supplierService.findSuppliersByIds(keys)
            );
        });
    }

    supplierLanguageCodeLoader() {
        return new Dataloader<number, SupplierLanguageCodeEntity>(
            async (keys: number[]) => {
                return <SupplierLanguageCodeEntity[]>(
                    await this.supplierLanguageCodeService.findSupplierLanguageCodeByIds(
                        keys,
                    )
                );
            },
        );
    }

    supplierCategoryLoader() {
        return new Dataloader<number, SupplierCategoryEntity>(
            async (keys: number[]) => {
                return <SupplierCategoryEntity[]>(
                    await this.supplierCategoryService.findSupplierCategoryByIds(
                        keys,
                    )
                );
            },
        );
    }

    equipmentParkLoader() {
        return new Dataloader<number, EquipmentPark>(async (keys: number[]) => {
            return this.equipmentParkService.findEquipmentParksByIds(keys);
        });
    }

    equipmentFundingLoader() {
        return new Dataloader<number, EquipmentFunding>(
            async (keys: number[]) => {
                return this.equipmentFundingService.findEquipmentFundingsByIds(
                    keys,
                );
            },
        );
    }

    ownerEntityLoader() {
        return new Dataloader<number, OwnerEntity>((keys: number[]) => {
            return this.ownerEntityService.findOwnerEntitiesByIds(keys);
        });
    }

    equipmentTechnicalGenreLoader() {
        return new Dataloader<number, EquipmentTechnicalGenre>(
            async (keys: number[]) => {
                return this.equipmenttechnicalGenreService.findEquipmentTechnicalGenresByIds(
                    keys,
                );
            },
        );
    }

    equipmentTechnicalThumbnailLoader() {
        return new Dataloader<number, EquipmentTechnicalThumbnail>(
            async (keys: number[]) => {
                return this.equipmentTechnicalThumbnailService.findEquipmentTechnicalThumbnailsByIds(
                    keys,
                );
            },
        );
    }

    documentTypeLoader() {
        return new Dataloader<number, DocumentTypeEntity>(
            async (keys: number[]) => {
                return this.documentTypeService.findDocumentTypesByIds(keys);
            },
        );
    }

    customerLoader() {
        return new Dataloader<number, CustomerEntity>(
            async (keys: number[]) => {
                return this.customerService.findCustomersByIds(keys);
            },
        );
    }

    equipmentParkUploadLoader() {
        return new Dataloader<number, UploadEntity[]>(
            async (keys: number[]) => {
                return this.equipmentParkService.findEquipmentParksPictures(
                    keys,
                );
            },
        );
    }

    equipmentParkDocumentUploadLoader() {
        return new Dataloader<number, UploadEntity>(async (keys: number[]) => {
            return this.equipmentParkDocumentService.findEquipmentParkDocumentUpload(
                keys,
            );
        });
    }

    equipmentParkSheetUploadLoader() {
        return new Dataloader<number, UploadEntity[]>(
            async (keys: number[]) => {
                return this.equipmentParkSheetService.findEquipmentParkSheetsPictures(
                    keys,
                );
            },
        );
    }

    equipmentTechnicalGoodsLoader() {
        return new Dataloader<number, Good>(async (keys: number[]) => {
            return this.goodsService.findGoodsByIds(keys);
        });
    }

    mediumSizedCenterLoader() {
        return new Dataloader<number, MediumSizedCentreEntity>(
            async (keys: number[]) => {
                return this.mediumSizedCenterService.findCentersByIds(keys);
            },
        );
    }

    obligationTypeLoader() {
        return new Dataloader<number, ObligationType>(
            async (keys: number[]) => {
                return this.obligationTypeService.findObligationTypesByIds(
                    keys,
                );
            },
        );
    }

    supplierNoteDocumentUploadLoader() {
        return new Dataloader<number, UploadEntity[]>(
            async (keys: number[]) => {
                return this.supplierNoteService.findSupplierNoteDocumentUpload(
                    keys,
                );
            },
        );
    }

    constructionSiteLoader() {
        return new Dataloader<number, ConstructionSite>(
            async (keys: number[]) => {
                return this.constructionSiteService.findConstructionSitesByIds(
                    keys,
                );
            },
        );
    }
}
