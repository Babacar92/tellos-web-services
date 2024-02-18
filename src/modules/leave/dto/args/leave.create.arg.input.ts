import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { LEAVE_ICON } from '../enums/leave.decision.enum';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { LeaveCheckStartAndEndDateConstraint } from '../../constraints/leave.check.start.and.end.date.constraint';
import { EmployeeSexEnum } from 'src/modules/employee/dto/enums/employee.sexe.enum';
import { ContractEnum } from 'src/modules/employee/dto/enums/employee.contract.enum';
import { DepartmentEntity } from 'src/entities/psql/DepartmentEntity';
import { DepartmentExistConstraint } from 'src/modules/department/constraints/department.exist.constraint';
import { LeaveEndDayEnum, LeaveStartDayEnum } from '../enums/leave.day.enum';
import { LeaveDistributionEntity } from 'src/entities/psql/LeaveDistributionEntity';
import { EntityExistConstraint } from '../../../entity/constraints/entity.exist.constraint';
import { EntityEntity } from '../../../../entities/psql/EntityEntity';
import { LeavePeriodExistConstraint } from 'src/modules/leave-period/constraints/leave-period.exist.constraint';
import { LeavePeriodEntity } from 'src/entities/psql/LeavePeriodEntity';

/**
 * Input for to create a new Leave
 */
export class LeaveCreateArgInput {
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
    @IsString()
    @IsOptional()
    @IsEnum(EmployeeSexEnum)
    @Transform(({ value }) => (value ? value : null))
    public gender?: string;

    /**
     * contract of Leave
     */
    @IsString()
    @IsOptional()
    @IsEnum(ContractEnum)
    @Transform(({ value }) => (value ? value : null))
    public contract?: string;

    /**
     * Icon of Leave
     */
    @IsString()
    @IsOptional()
    @IsEnum(LEAVE_ICON)
    @Transform(({ value }) => (value ? value : null))
    public decision?: string = 'REQUESTED';

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
    @Validate(LeaveCheckStartAndEndDateConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;

    /**
     * The employee who want a Leave
     */
    public employee?: number | Employee;

    /**
     * service of leave
     */
    @Validate(DepartmentExistConstraint, {})
    @IsOptional()
    @Transform(({ value }) => DepartmentEntity.init(value))
    public service?: DepartmentEntity;

    /**
     * Types of leave
     */
    @IsOptional()
    public types?: LeaveDistributionEntity[];

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
     * The leave period
     */
    @IsOptional()
    @Validate(LeavePeriodExistConstraint, {})
    @Transform(({ value }) => LeavePeriodEntity.init(value))
    public leavePeriod?: LeavePeriodEntity;
}
