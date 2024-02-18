import { CustomerEntity } from '../../../../entities/psql/CustomerEntity';
import { BusinessPaymentModeEntity } from '../../../../entities/psql/BusinessPaymentModeEntity';
import { BusinessPaymentTypeEntity } from '../../../../entities/psql/BusinessPaymentTypeEntity';
import { BusinessTenderTypeEntity } from '../../../../entities/psql/BusinessTenderTypeEntity';
import { BusinessMarketTypeEntity } from '../../../../entities/psql/BusinessMarketTypeEntity';
import { Employee } from '../../../../entities/psql/EmployeeEntity';
import { GraphqlFileUploadValidate } from '../../../../libs/upload/decorators/validators/GraphqlFileUploadValidate';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CustomerExistConstraint } from '../../../customer/constraints/customer.exist.constraint';
import { BusinessPaymentModeExistConstraint } from '../../../business-payment-mode/constraints/business-payment-mode.exist.constraint';
import { BusinessPaymentTypeExistConstraint } from '../../../business-payment-type/constraints/business-payment-type.exist.constraint';
import { BusinessTenderTypeExistConstraint } from '../../../business-tender-type/constraints/business-tender-type.exist.constraint';
import { BusinessMarketTypeExistConstraint } from '../../../business-market-type/constraints/business-market-type.exist.constraint';
import { EmployeeExistConstraint } from '../../../employee/constraints/employee.exist.constraint';
import { BusinessUnitEnum } from '../enums/business-unit.enum';
import { BusinessExistConstraint } from '../../constraints/business.exist.constraint';
import { BusinessTypeEnum } from '../enums/business-type.enum';
import { BusinessStatusEnum } from '../enums/business-status.enum';

/**
 * Input for to update a new Quick Access
 */
export class BusinessUpdateArgInput {
    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessExistConstraint, {})
    public id: number;

    /**
     * The customer
     */
    @IsOptional()
    @Transform(({ value }) => CustomerEntity.init(value))
    @Validate(CustomerExistConstraint, {})
    public customer?: CustomerEntity;

    /**
     * The paymentMode
     */
    @IsOptional()
    @Transform(({ value }) => BusinessPaymentModeEntity.init(value))
    @Validate(BusinessPaymentModeExistConstraint, {})
    public paymentMode?: BusinessPaymentModeEntity;

    /**
     * The paymentType
     */
    @IsOptional()
    @Transform(({ value }) => BusinessPaymentTypeEntity.init(value))
    @Validate(BusinessPaymentTypeExistConstraint, {})
    public paymentType?: BusinessPaymentTypeEntity;

    /**
     * The tenderType
     */
    @IsOptional()
    @Transform(({ value }) => BusinessTenderTypeEntity.init(value))
    @Validate(BusinessTenderTypeExistConstraint, {})
    public tenderType?: BusinessTenderTypeEntity;

    /**
     * The marketType
     */
    @IsOptional()
    @Transform(({ value }) => BusinessMarketTypeEntity.init(value))
    @Validate(BusinessMarketTypeExistConstraint, {})
    public marketType?: BusinessMarketTypeEntity;

    /**
     * The worksChief
     */
    @IsOptional()
    @Transform(({ value }) => Employee.init(value))
    @Validate(EmployeeExistConstraint, {})
    public worksChief?: Employee;

    /**
     * The worksManager
     */
    @IsOptional()
    @Transform(({ value }) => Employee.init(value))
    @Validate(EmployeeExistConstraint, {})
    public worksManager?: Employee;

    /**
     * The mainSiteManager
     */
    @IsOptional()
    @Transform(({ value }) => Employee.init(value))
    @Validate(EmployeeExistConstraint, {})
    public mainSiteManager?: Employee;

    /**
     * The siteManager2
     */
    @IsOptional()
    @Transform(({ value }) => Employee.init(value))
    @Validate(EmployeeExistConstraint, {})
    public siteManager2?: Employee;

    /**
     * The siteManager3
     */
    @IsOptional()
    @Transform(({ value }) => Employee.init(value))
    @Validate(EmployeeExistConstraint, {})
    public siteManager3?: Employee;

    /**
     * The commercial
     */
    @IsOptional()
    @Transform(({ value }) => Employee.init(value))
    @Validate(EmployeeExistConstraint, {})
    public commercial?: Employee;

    /**
     * The picture
     */
    @IsOptional()
    @GraphqlFileUploadValidate({})
    public picture?: GraphqlFileUpload;

    /**
     * The email
     */
    @IsOptional()
    @IsEmail()
    public email?: string;

    /**
     * The code
     */
    @IsOptional()
    @IsString()
    public code?: string;

    /**
     * The label
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * The externalCode
     */
    @IsOptional()
    @IsString()
    public externalCode?: string;

    /**
     * The payingOwner
     */
    @IsOptional()
    @IsString()
    public payingOwner?: string;

    /**
     * The mainOwner
     */
    @IsOptional()
    @IsString()
    public mainOwner?: string;

    /**
     * The owner
     */
    @IsOptional()
    @IsString()
    public owner?: string;

    /**
     * The origin
     */
    @IsOptional()
    @IsString()
    public origin?: string;

    /**
     * The referenceCase
     */
    @IsOptional()
    @IsString()
    public referenceCase?: string;

    /**
     * The agency
     */
    @IsOptional()
    @IsString()
    public agency?: string;

    /**
     * The address
     */
    @IsOptional()
    @IsString()
    public address?: string;

    /**
     * The postalCode
     */
    @IsOptional()
    @IsString()
    public postalCode?: string;

    /**
     * The city
     */
    @IsOptional()
    @IsString()
    public city?: string;

    /**
     * The country
     */
    @IsOptional()
    @IsString()
    public country?: string;

    /**
     * The phone
     */
    @IsOptional()
    @IsString()
    public phone?: string;

    /**
     * The website
     */
    @IsOptional()
    @IsString()
    public website?: string;

    /**
     * The gps
     */
    @IsOptional()
    @IsString()
    public gps?: string;

    /**
     * The delegatedCustomer
     */
    @IsOptional()
    @IsString()
    public delegatedCustomer?: string;

    /**
     * The economist
     */
    @IsOptional()
    @IsString()
    public economist?: string;

    /**
     * The engineeringOffice
     */
    @IsOptional()
    @IsString()
    public engineeringOffice?: string;

    /**
     * The fuildEngineeringOffice
     */
    @IsOptional()
    @IsString()
    public fuildEngineeringOffice?: string;

    /**
     * The groundEngineeringOffice
     */
    @IsOptional()
    @IsString()
    public groundEngineeringOffice?: string;

    /**
     * The controlOffice
     */
    @IsOptional()
    @IsString()
    public controlOffice?: string;

    /**
     * The pilot
     */
    @IsOptional()
    @IsString()
    public pilot?: string;

    /**
     * The safetyCoordinator
     */
    @IsOptional()
    @IsString()
    public safetyCoordinator?: string;

    /**
     * The underCover
     */
    @IsOptional()
    @IsBoolean()
    public underCover?: boolean;

    /**
     * The bidBond
     */
    @IsOptional()
    @IsBoolean()
    public bidBond?: boolean;

    /**
     * The estimatedAmount
     */
    @IsOptional()
    @IsNumber()
    public estimatedAmount?: number;

    /**
     * The startDate
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    /**
     * The endDate
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    /**
     * The startDateStudy
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDateStudy?: Date;

    /**
     * The endDateStudy
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDateStudy?: Date;

    /**
     * The applicationDate
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public applicationDate?: Date;

    /**
     * The retrieveDate
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public retrieveDate?: Date;

    /**
     * The limiteDate
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public limiteDate?: Date;

    /**
     * The depositDate
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public depositDate?: Date;

    /**
     * The workDuration
     */
    @IsOptional()
    @IsInt()
    public workDuration?: number;

    /**
     * The unit
     */
    @IsOptional()
    @IsEnum(BusinessUnitEnum, {})
    public unit?: BusinessUnitEnum;

    /**
     * The type
     */
    @IsOptional()
    @IsEnum(BusinessTypeEnum, {})
    public type?: BusinessTypeEnum;

    /**
     * The status
     */
    @IsOptional()
    @IsEnum(BusinessStatusEnum, {})
    public status?: BusinessStatusEnum;

    /**
     * The isEditable
     */
    @IsOptional()
    @IsBoolean()
    public isEditable?: boolean;

    /**
     * Is abandoned
     */
    @IsOptional()
    @IsBoolean()
    public abandon?: boolean;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
