import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { BusinessExistConstraint } from '../../../business/constraints/business.exist.constraint';
import { Transform } from 'class-transformer';
import { BusinessEntity } from '../../../../entities/psql/BusinessEntity';
import { BusinessBatchStatusExistConstraint } from '../../../business-batch-status/constraints/business-batch-status.exist.constraint';
import { BusinessBatchStatusEntity } from '../../../../entities/psql/BusinessBatchStatusEntity';
import { EmployeeExistConstraint } from '../../../employee/constraints/employee.exist.constraint';
import { Employee } from '../../../../entities/psql/EmployeeEntity';

/**
 * Input for to create a new Quick Access
 */
export class BusinessBatchCreateArgInput {
    /**
     * The business
     */
    @IsOptional()
    @Validate(BusinessExistConstraint, {})
    @Transform(({ value }) => BusinessEntity.init(value))
    public business?: BusinessEntity;

    /**
     * The status
     */
    @IsOptional()
    @Validate(BusinessBatchStatusExistConstraint, {})
    @Transform(({ value }) => BusinessBatchStatusEntity.init(value))
    public status?: BusinessBatchStatusEntity;

    /**
     * The commercial
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public commercial?: Employee;

    /**
     * The label
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * The apology
     */
    @IsOptional()
    @IsString()
    public apology?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;
}
