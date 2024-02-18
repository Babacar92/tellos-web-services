//NestJs
import { Module, Type } from '@nestjs/common';

//Modules
import { TokenModule } from '@Modules/token/token.module';
import { LoginModule } from '@Modules/login/login.module';
import { ActionLogModule } from '@Modules/action-log/action-log.module';
import { QuickAccessModule } from '@Modules/quick-access/quick-access.module';
import { HtmlToPdfModule } from '@Libs/html-to-pdf/html-to-pdf.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EntityModule } from '@Modules/entity/entity.module';
import { DocumentCategoryModule } from '@Modules/document-category/document-category.module';
import { EmployeeModule } from '@Modules/employee/employee.module';
import { DepartmentModule } from '@Modules/department/department.module';
import { QualificationNameModule } from '@Modules/qualification-name/qualification-name.module';
import { QualificationTypeModule } from '@Modules/qualification-type/qualification-type.module';
import { QualificationModule } from '@Modules/qualification/qualification.module';
import { CareerPathModule } from '@Modules/career-path/career-path.module';
import { DocumentTypeModule } from '@Modules/document-type/document-type.module';
import { ParagraphFrameModule } from '@Modules/paragraph-frame/paragraph-frame.module';
import { EmployeeDocumentModule } from '@Modules/employee-document/employee-document.module';
import { LeaveModule } from '@Modules/leave/leave.module';
import { ContractInfoModule } from '@Modules/contract-info/contract-info.module';
import { ContractTypeEntryModule } from '@Modules/contract-type-entry/contract-type-entry.module';
import { ContractLevelModule } from '@Modules/contract-level/contract-level.module';
import { ContractSectionModule } from '@Modules/contract-section/contract-section.module';
import { ContractApprenticeModule } from '@Modules/contract-apprentice/contract-apprentice.module';
import { ConsoleModule } from '@Libs/bin/console/console.module';
import { FetchUnexistEncryptionCommand } from './commands/FetchUnexistEncryptionCommand';
import { NotificationTypeModule } from '@Modules/notification-type/notification-type.module';
import { NotificationModule } from '@Modules/notification/notification.module';
import { ContractCommentModule } from '@Modules/contract-comment/contract-comment.module';
import { CustomerModule } from '@Modules/customer/customer.module';
import { CustomerContactModule } from '@Modules/customer-contact/customer-contact.module';
import { CustomerNoteModule } from '@Modules/customer-note/customer-note.module';
import { CustomerDocumentModule } from '@Modules/customer-document/customer-document.module';
import { CustomerTimelineModule } from '@Modules/customer-timeline/customer-timeline.module';
import { BusinessMarketTypeModule } from '@Modules/business-market-type/business-market-type.module';
import { LeaveDistributionModule } from '@Modules/leave-distribution/leave-distribution.module';
import { JobDescriptionModule } from '@Modules/job-description/job-description.module';
import { BusinessPaymentModeModule } from '@Modules/business-payment-mode/business-payment-mode.module';
import { BusinessPaymentTypeModule } from '@Modules/business-payment-type/business-payment-type.module';
import { BusinessTenderTypeModule } from '@Modules/business-tender-type/business-tender-type.module';
import { BusinessDocumentTypeModule } from '@Modules/business-document-type/business-document-type.module';
import { BusinessDocumentClassificationModule } from '@Modules/business-document-classification/business-document-classification.module';
import { BusinessModule } from '@Modules/business/business.module';
import { ContractTypePaymentModule } from '@Modules/contract-type-payment/contract-type-payment.module';
import { MedicalVisitModule } from '@Modules/medical-visit/medical-visit.module';
import { EmployeeDisciplinaryModule } from '@Modules/employee-disciplinary/employee-disciplinary.module';
import { BusinessBatchStatusModule } from '@Modules/business-batch-status/business-batch-status.module';
import { BusinessBatchModule } from '@Modules/business-batch/business-batch.module';
import { BusinessDocumentModule } from '@Modules/business-document/business-document.module';
import { ContractModule } from '@Modules/contract/contract.module';
import { BusinessBudgetModule } from '@Modules/business-budget/business-budget.module';
import { RegulationCodeModule } from '@Modules/regulation-code/regulation-code.module';
import { AdminDocumentModule } from '@Modules/admin-document/admin-document.module';
import { LoginPermissionModule } from '@Modules/login-permission/login-permission.module';
import { ExpensePostModule } from '@Modules/expense-post/expense-post.module';
import { SectionCodeModule } from '@Modules/section-code/section-code.module';
import { PurchaseAccountModule } from '@Modules/purchase-account/purchase-account.module';
import { MediumSizedCentreModule } from '@Modules/medium-sized-centre/medium-sized-centre.module';
import { CategoryEquipmentModule } from '@Modules/category-equipment/category-equipment.module';
import { LeavePeriodModule } from '@Modules/leave-period/leave-period.module';
import { WorkUnitModule } from '@Modules/work-unit/work-unit.module';
import { AddDefaultUsersCommand } from './commands/AddDefaultUsersCommand';
import { EquipmentModule } from '@Modules/equipment/equipment.module';
import { AdministrativeMaterialModule } from '@Modules/administrative-material/administrative-material.module';
import { TheoreticalHoursOfUseModule } from '@Modules/theoretical-hours-of-use/theoretical-hours-of-use.module';
import { EquipmentDocumentModule } from '@Modules/equipment-document/equipment-document.module';
import { ArticleFamilyModule } from '@Modules/article-family/article-family.module';
import { AddDefaultSectionCodeAndExpensePostCommand } from './commands/AddDefaultSectionCodeAndExpensePostCommand';
import { EquipmentParkUnitModule } from '@Modules/equipment-park-unit/equipment-park-unit.module';
import { GoodModule } from '@Modules/good/good.module';
import { InseeCodeModule } from '@Modules/insee-code/insee-code.module';
import { ZoneModule } from '@Modules/zone/zone.module';
import { ActivityModule } from '@Modules/activity/activity.module';
import { GoodReferencePriceModule } from '@Modules/good-reference-price/good-reference-price.module';
import { WorkforceRateModule } from '@Modules/workforce-rate/workforce-rate.module';
import { EquipmentRateModule } from '@Modules/equipment-rate/equipment-rate.module';
import { EquipmentParkModule } from '@Modules/equipments/equipment-park/equipment-park.module';
import { EquipmentAssignmentModule } from '@Modules/equipments/equipment-assignment/equipment-assignment.module';
import { EquipmentFundingModule } from '@Modules/equipment-funding/equipment-funding.module';
import { OwnerEntityModule } from '@Modules/owner-entity/owner-entity.module';
import { EquipmentTheoricalHourModule } from '@Modules/equipment-theorical-hour/equipment-theorical-hour.module';
import { EquipmentTechnicalGenreModule } from '@/modules/equipment-technical-genre/equipment-technical-genre.module';
import { EquipmentAdministrativeModule } from '@Modules/equipments/equipment-administrative/equipment-administrative.module';
import { EquipmentTechnicalModule } from '@Modules/equipments/equipment-technical/equipment-technical.module';
import { EquipmentTechnicalThumbnailModule } from '@Modules/equipment-technical-thumbnail/equipment-technical-thumbnail.module';
import { EquipmentParkDocumentModule } from '@Modules/equipments/equipment-park-document/equipment-park-document.module';

//Supplier
import { SupplierGroupModule } from '@/modules/group-supplier/supplier.group.module';

//Controllers
import { AppController } from './controllers/app.controller';
import { MailerTemplateController } from './controllers/mailer.template.controller';

//Libs
import { CountryModule } from '@Libs/country/country.module';
import { GraphModule } from '@Libs/graphql/graph.module';
import { HandlerModule } from '@Libs/handler/handler.module';
import { MailerModule } from '@Libs/mailers/mailer.module';
import { TranslationModule } from '@Libs/translation/translation.module';
import { UploadModule } from '@Libs/upload/upload.module';
import { AuthModule } from '@Libs/auth/auth.module';
import { DatabaseModule } from '@Libs/databases/databases.module';
import { EquipmentParkObservationModule } from './modules/equipments/equipment-park-observation/equipment-park-observation.module';
import { EquipmentParkSheetModule } from './modules/equipments/equipment-park-sheet/equipment-park-sheet.module';
import { EquipmentParkPreparatorySheetModule } from './modules/equipments/equipment-park-preparatory-sheet/equipment-park-preparatory-sheet.module';
import { EquipmentParkObligationModule } from './modules/equipments/equipment-park-obligation/equipment-park-obligation.module';
import { EquipmentParkMaintenanceModule } from './modules/equipments/equipment-park-maintenance/equipment-park-maintenance.module';
import { StockPileModule } from './modules/stock-pile/stock-pile.module';
import { ConstructionSiteModule } from './modules/construction-site/construction-site.module';

@Module({
    imports: [
        DatabaseModule,
        CountryModule,
        GraphModule,
        MailerModule,
        HandlerModule,
        TranslationModule,
        AuthModule,
        ActionLogModule,
        UploadModule,
        TokenModule,
        LoginModule,
        QuickAccessModule,
        HtmlToPdfModule,
        EntityModule,
        DocumentCategoryModule,
        DocumentTypeModule,
        EmployeeModule,
        EmployeeDocumentModule,
        DepartmentModule,
        QualificationNameModule,
        QualificationTypeModule,
        QualificationModule,
        CareerPathModule,
        ParagraphFrameModule,
        LeaveModule,
        ContractModule,
        ContractInfoModule,
        ContractTypeEntryModule,
        ContractLevelModule,
        ContractSectionModule,
        ContractApprenticeModule,
        NotificationTypeModule,
        NotificationModule,
        ContractCommentModule,
        CustomerModule,
        CustomerContactModule,
        CustomerNoteModule,
        CustomerDocumentModule,
        CustomerTimelineModule,
        LeaveDistributionModule,
        JobDescriptionModule,
        BusinessMarketTypeModule,
        BusinessPaymentModeModule,
        BusinessPaymentTypeModule,
        BusinessTenderTypeModule,
        BusinessDocumentTypeModule,
        BusinessDocumentClassificationModule,
        BusinessBatchStatusModule,
        BusinessBatchModule,
        BusinessDocumentModule,
        BusinessBudgetModule,
        BusinessModule,
        ContractTypePaymentModule,
        MedicalVisitModule,
        EmployeeDisciplinaryModule,
        RegulationCodeModule,
        AdminDocumentModule,
        LoginPermissionModule,
        ExpensePostModule,
        SectionCodeModule,
        PurchaseAccountModule,
        MediumSizedCentreModule,
        CategoryEquipmentModule,
        LeavePeriodModule,
        WorkUnitModule,
        EquipmentParkUnitModule,
        EquipmentModule,
        AdministrativeMaterialModule,
        TheoreticalHoursOfUseModule,
        EquipmentDocumentModule,
        ArticleFamilyModule,
        GoodModule,
        InseeCodeModule,
        ZoneModule,
        ActivityModule,
        GoodReferencePriceModule,
        WorkforceRateModule,
        EquipmentRateModule,
        EquipmentParkModule,
        EquipmentAssignmentModule,
        EquipmentAssignmentModule,
        EquipmentFundingModule,
        StockPileModule,
        OwnerEntityModule,
        EquipmentTheoricalHourModule,
        EquipmentAdministrativeModule,
        EquipmentTechnicalGenreModule,
        EquipmentTechnicalThumbnailModule,
        EquipmentTechnicalModule,
        EquipmentParkDocumentModule,
        EquipmentParkObservationModule,
        EquipmentParkSheetModule,
        EquipmentParkPreparatorySheetModule,
        SupplierGroupModule,
        EquipmentParkObligationModule,
        SupplierGroupModule,
        EquipmentParkMaintenanceModule,
        ConstructionSiteModule,

        // It must be the last
        ConsoleModule,
    ],
    controllers: [AppController, MailerTemplateController],
    providers: [
        FetchUnexistEncryptionCommand,
        AddDefaultUsersCommand,
        AddDefaultSectionCodeAndExpensePostCommand,
    ],
})
export class AppModule {
    /**
     * The application
     */
    public static app?: NestExpressApplication;

    /**
     * Set the application
     * @param app
     */
    public static setApplication(app: NestExpressApplication): void {
        if (!AppModule.app && app) AppModule.app = app;
    }

    /**
     * Return an service if exist
     * @param typeOrToken
     * @param options
     * @returns
     */
    public static get<TInput = any, TResult = TInput>(
        typeOrToken: Type<TInput> | string | symbol,
        options?: {
            strict?: boolean;
            each?: undefined | false;
        },
    ): TResult {
        return AppModule.app ? AppModule.app.get(typeOrToken, options) : null;
    }
}
