import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Validate,
} from 'class-validator';
import { LeavePeriodExistConstraint } from '../../constraints/leave-period.exist.constraint';
import { Transform } from 'class-transformer';
import { LeavePeriodCheckDateFromAndDateToConstraint } from '../../constraints/leave-period.check.date.from.and.date.to.constraint';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Employee } from 'src/entities/psql/EmployeeEntity';

/**
 * Input for to update a new LeavePeriod
 */
export class LeavePeriodUpdateArgInput {
    /**
     * The id of Leave
     */
    @IsNotEmpty()
    @Validate(LeavePeriodExistConstraint, {})
    public id: number;

    /**
     * Date From of earned Leave
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
     * countAcquiredLeave Leave Period
     */
    @IsOptional()
    @IsNumber()
    public countAcquiredLeave?: number;

    /**
     * count Unpaid Leave Period
     */
    @IsOptional()
    @IsNumber()
    public countUsableLeave?: number;

    /**
     * Date to of Leave Period
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
     * The employee of Leave Period
     */
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;
    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
