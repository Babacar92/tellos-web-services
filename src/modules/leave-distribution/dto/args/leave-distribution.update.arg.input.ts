import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { LeaveDistributionExistConstraint } from "../../constraints/leave-distribution.exist.constraint";
import { LeaveExistConstraint } from "src/modules/leave/constraints/leave.exist.constraint";
import { Transform } from "class-transformer";
import { LeaveEntity } from "src/entities/psql/LeaveEntity";
import { LEAVE_TYPE } from "../enums/leave-distribution.type.enum";

/**
 * Input for to update a new Quick Access
 */
export class LeaveDistributionUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(LeaveDistributionExistConstraint, {

    })
    public id: number;

    /**
     * The name of Leave Distribution
     */
    @IsOptional()
    @IsString()
    @IsEnum(LEAVE_TYPE)
    @Transform(({ value }) => value ? value : null)
    public name?: string;

    /**
     * The total of Leave
     */
    @IsOptional()
    @IsNumber()
    public total?: number;

    /**
     * leave
     */
    @IsOptional()
    @Validate(LeaveExistConstraint, {

    })
    @Transform(({ value }) => LeaveEntity.init(value))
    public leave?: LeaveEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}