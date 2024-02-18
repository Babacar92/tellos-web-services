import { IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { LeaveExistConstraint } from "src/modules/leave/constraints/leave.exist.constraint";

/**
 * Input for to filter a new Quick Access
 */
export class LeaveDistributionFilterArgInput extends DatabaseFilterArg {

    /**
     * The target name for filter
     */
    @IsOptional()
    @IsString()
    public name?: string;

    /**
     * The target names for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public names?: string[];
    
    /**
     * leaveId for filter 
     */
    @IsOptional()
    @IsInt()
    @Validate(LeaveExistConstraint, {
   
    })
    public leaveId?: number;
     
    /**
     * leaveIds for filter
     */
    @IsOptional()
    @IsInt()
    @Validate(LeaveExistConstraint, {
   
    })
    public leaveIds?: number;


}