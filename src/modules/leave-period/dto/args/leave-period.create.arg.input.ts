import {
    IsBoolean,
    IsDate,
    IsNumber,
    IsOptional,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { LeavePeriodCheckDateFromAndDateToConstraint } from '../../constraints/leave-period.check.date.from.and.date.to.constraint';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Employee } from 'src/entities/psql/EmployeeEntity';

/**
 * Input for to create a leave period
 */
export class LeavePeriodCreateArgInput {
    /**
     * Date From of leave period
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateFrom?: Date;

    /**
     * count usable leave period
     */
    @IsOptional()
    @IsNumber()
    public countUsableLeave?: number;

    /**
     * count acquired leave period
     */
    @IsOptional()
    @IsNumber()
    public countAcquiredLeave?: number;

    /**
     * Date to of leave period
     */
    @IsOptional()
    @IsDate()
    @Validate(LeavePeriodCheckDateFromAndDateToConstraint, {})
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateTo?: Date;

    /**
     * The employee of leave period
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean = true;
}
