import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { LeaveEntity } from "src/entities/psql/LeaveEntity";
import { LeaveExistConstraint } from "src/modules/leave/constraints/leave.exist.constraint";
import { LEAVE_TYPE } from "../enums/leave-distribution.type.enum";
/**
 * Input for to create a new Quick Access
 */
export class LeaveDistributionCreateArgInput {

    /**
     * The name of Leave Distribution
     */
    @IsString()
    @IsEnum(LEAVE_TYPE)
    @Transform(({ value }) => value ? value : null)
    public name?: string;

    /**
     * The motive of Leave
     */
    @IsNumber()
    public total?: number;

    /**
     * leave
     */
    @Validate(LeaveExistConstraint, {

    })
    @Transform(({ value }) => LeaveEntity.init(value))
    public leave?: LeaveEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}