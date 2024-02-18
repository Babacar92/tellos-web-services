import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { LeaveExistConstraint } from '../../constraints/leave.exist.constraint';
import { Transform } from 'class-transformer';
import { LeaveCheckStartAndEndDateConstraint } from '../../constraints/leave.check.start.and.end.date.constraint';
import { DepartmentExistConstraint } from 'src/modules/department/constraints/department.exist.constraint';
import { DepartmentEntity } from 'src/entities/psql/DepartmentEntity';
import { EmployeeSexEnum } from 'src/modules/employee/dto/enums/employee.sexe.enum';
import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import { LeaveEndDayEnum, LeaveStartDayEnum } from '../enums/leave.day.enum';
import { LeaveDistributionEntity } from 'src/entities/psql/LeaveDistributionEntity';
import { EntityExistConstraint } from '../../../entity/constraints/entity.exist.constraint';
import { EntityEntity } from '../../../../entities/psql/EntityEntity';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { LeavePeriodExistConstraint } from 'src/modules/leave-period/constraints/leave-period.exist.constraint';
import { LeavePeriodEntity } from 'src/entities/psql/LeavePeriodEntity';

/**
 * Input for to update a new Leave
 */
export class LeaveUpdateArgInput {
    /**
     * The id of Leave
     */
    @IsOptional()
    @Validate(LeaveExistConstraint, {})
    public id?: number;

    /**
     * The id of Leave
     */
    @IsOptional()
    public ids?: number[];

    /**
     * The motive of Leave
     */
    @IsString()
    @IsOptional()
    public motive?: string;

    /**
     * Entity company of Leave
     */
    @IsOptional()
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * gender of Leave
     */
    @IsOptional()
    @IsString()
    @IsEnum(EmployeeSexEnum)
    @Transform(({ value }) => (value ? value : null))
    public gender?: string;

    /**i
     * Types of leave
     */
    @IsOptional()
    public types?: LeaveDistributionEntity[];

    /**
     * contract of Leave
     */
    @IsString()
    @IsOptional()
    @IsEnum(ContractEnum)
    @Transform(({ value }) => (value ? value : null))
    public contract?: string;

    /**
     * Start date of Leave
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
     * End date of Leave
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Validate(LeaveCheckStartAndEndDateConstraint, {})
    public endDate?: Date;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

    /**
     * service of leave
     */
    @Validate(DepartmentExistConstraint, {})
    @IsOptional()
    @Transform(({ value }) => DepartmentEntity.init(value))
    public service?: DepartmentEntity;

    /**
     * startDay of Leave
     */
    @IsString()
    @IsOptional()
    @IsEnum(LeaveStartDayEnum)
    @Transform(({ value }) => (value ? value : null))
    public startDay?: string;

    /**
     * endDay of Leave
     */
    @IsString()
    @IsOptional()
    @IsEnum(LeaveEndDayEnum)
    @Transform(({ value }) => (value ? value : null))
    public endDay?: string;

    /**
     * The decision maker who accept or denied the leave
     */
    public decisionMaker?: number | Employee;

    /**
     * The leave period
     */
    @IsOptional()
    @Validate(LeavePeriodExistConstraint, {})
    @Transform(({ value }) => LeavePeriodEntity.init(value))
    public leavePeriod?: LeavePeriodEntity;
}
