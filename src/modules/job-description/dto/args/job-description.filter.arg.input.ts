import { IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { DepartmentExistConstraint } from "src/modules/department/constraints/department.exist.constraint";
import { EmployeeExistConstraint } from "src/modules/employee/constraints/employee.exist.constraint";

/**
 * Input for to filter a new Job Description
 */
export class JobDescriptionFilterArgInput extends DatabaseFilterArg {

    /**
     * The target entitys for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public entities?: number[];

    /**
      * The departments id
      */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public departments?: number[];

}