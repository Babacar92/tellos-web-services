import { IsDate, IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { EmployeeExistConstraint } from "src/modules/employee/constraints/employee.exist.constraint";

/**
 * Input for to filter a new Contract Preview
 */
export class ContractFilterArgInput extends DatabaseFilterArg {

    /**
     * The target status for filter
     */
    @IsOptional()
    @IsString()
    public status?: string;
    
    @IsOptional()
    @IsInt()
    @Validate(EmployeeExistConstraint, {
  
    })
    public employeeId?: number;
  
    /**
     * The employe id
     */
    @IsOptional()
    @IsInt()
    @Validate(EmployeeExistConstraint, {
          each: true,
    })
    public employeeIds?: number[];

}