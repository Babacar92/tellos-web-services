import { IsEnum, IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { EmployeeExistConstraint } from "src/modules/employee/constraints/employee.exist.constraint";

/**
 * Input for to filter a new a EmployeeDisciplinary
 */
export class EmployeeDisciplinaryFilterArgInput extends DatabaseFilterArg {

    /**
     * The employe id
    */
    @IsOptional()
    @IsInt()
    @Validate(EmployeeExistConstraint, {
  
    })
    public employeeId?: number;

    /**
     * The employees id
    */
    @IsOptional()
    @IsInt()
    @Validate(EmployeeExistConstraint, {
        each: true
    })
    public employeeIds?: number[];

}