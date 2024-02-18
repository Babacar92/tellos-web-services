import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
    CONTRACT_AGE_CATEGORY,
    CONTRACT_CATEGORY,
    CONTRACT_LEAVING_REASON,
    CONTRACT_RENEWAL,
} from '../enums/contract-info.enum';
import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { ContractTypeEntryEntity } from 'src/entities/psql/ContractTypeEntryEntity';
import { ContractTypeEntryExistConstraint } from 'src/modules/contract-type-entry/constraints/contract-type-entry.exist.constraint';
import { ContractLevelExistConstraint } from 'src/modules/contract-level/constraints/contract-level.exist.constraint';
import { ContractLevelEntity } from 'src/entities/psql/ContractLevelEntity';
import { ContractSectionExistConstraint } from 'src/modules/contract-section/constraints/contract-section.exist.constraint';
import { ContractSectionEntity } from 'src/entities/psql/ContractSectionEntity';
import { ContractApprenticeEntity } from 'src/entities/psql/ContractApprenticeEntity';
import { ContractApprenticeExistConstraint } from 'src/modules/contract-apprentice/constraints/contract-apprentice.exist.constraint';
import { ContractInfoCheckStartAndEndDateConstraint } from '../../constraints/contract-info.check.start.and.end.date.constraint';
import { ContractTypePaymentEntity } from 'src/entities/psql/ContractTypePaymentEntity';
import { ContractTypePaymentExistConstraint } from 'src/modules/contract-type-payment/constraints/contract-type-payment.exist.constraint';
import { JobDescriptionEntity } from '../../../../entities/psql/JobDescriptionEntity';
import { JobDescriptionExistConstraint } from '../../../job-description/constraints/job-description.exist.constraint';

/**
 * Input for to create a new Employee Contract
 */
export class ContractCreateArgInput {
    /**
     * entry date of contract
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public entryDate?: Date;

    /**
     * Seniority date of contract
     */
    @IsOptional()
    @IsDate()
    @Validate(ContractInfoCheckStartAndEndDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public seniorityDate?: Date;

    /**
     * SAGE pay code of contract
     */
    @IsOptional()
    @IsString()
    public sagePayCode?: string;

    /**
     * end of trial of contract
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endTrialPeriod?: Date;

    /**
     * renewal of contract
     */
    @IsOptional()
    @IsString()
    @IsEnum(CONTRACT_RENEWAL)
    @Transform(({ value }) => (value ? value : null))
    public renewal?: string;

    /**
     * end renewal of contract
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endRenewal?: Date;

    /**
     * type of contract
     */
    @IsOptional()
    @IsString()
    @IsEnum(ContractEnum)
    @Transform(({ value }) => (value ? value : null))
    public typeContract?: string;

    /**
     * end of contract CDD
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endContractCdd?: Date;

    /**
     * amendment CDD
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public amendmentCdd?: Date;

    /**
     * Date of departure
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public departureDate?: Date;

    /**
     * reason for leaving
     */
    @IsOptional()
    @IsString()
    @IsEnum(CONTRACT_LEAVING_REASON)
    @Transform(({ value }) => (value ? value : null))
    public leavingRaison?: string;

    /**
     * job
     */
    @IsOptional()
    @IsString()
    public job?: string;

    /**
     * category
     */
    @IsOptional()
    @IsString()
    @IsEnum(CONTRACT_CATEGORY)
    @Transform(({ value }) => (value ? value : null))
    public category?: string;

    /**
     * code INSEE of contract
     */
    @IsOptional()
    @IsString()
    public code?: string;

    /**
     * position of contract
     */
    @IsOptional()
    @IsString()
    public position?: string;

    /**
     * coefficient
     */
    @IsOptional()
    @IsString()
    public coefficient?: string;

    /**
     *large rate dep
     */
    @IsOptional()
    @IsString()
    public largeRateDep?: string;

    /**
     * age category
     */
    @IsOptional()
    @IsString()
    @IsEnum(CONTRACT_AGE_CATEGORY)
    @Transform(({ value }) => (value ? value : null))
    public ageCategory?: string;

    /**
     * employee contract
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * type entry of employee contract
     */
    @IsOptional()
    @Validate(ContractTypeEntryExistConstraint, {})
    @Transform(({ value }) => ContractTypeEntryEntity.init(value))
    public typeEntry?: ContractTypeEntryEntity;

    /**
     * type payment of employee contract
     */
    @IsOptional()
    @Validate(ContractTypePaymentExistConstraint, {})
    @Transform(({ value }) => ContractTypePaymentEntity.init(value))
    public typePayment?: ContractTypePaymentEntity;

    /**
     * level of employee contract
     */
    @IsOptional()
    @Validate(ContractLevelExistConstraint, {})
    @Transform(({ value }) => ContractLevelEntity.init(value))
    public level?: ContractLevelEntity;

    /**
     * section of employee contract
     */
    @IsOptional()
    @Validate(ContractSectionExistConstraint, {})
    @Transform(({ value }) => ContractSectionEntity.init(value))
    public section?: ContractSectionEntity;

    /**
     * apprentice of employee contract jobDescription
     */
    @IsOptional()
    @Validate(ContractApprenticeExistConstraint, {})
    @Transform(({ value }) => ContractApprenticeEntity.init(value))
    public apprentice?: ContractApprenticeEntity;

    /**
     * Job Description
     */
    @IsOptional()
    @Validate(JobDescriptionExistConstraint, {})
    @Transform(({ value }) => JobDescriptionEntity.init(value))
    public jobDescription?: JobDescriptionEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;
}
