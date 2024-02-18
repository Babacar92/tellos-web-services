import { IsInt, IsOptional, IsString,Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { DepartmentExistConstraint } from "src/modules/department/constraints/department.exist.constraint";
import { EmployeeExistConstraint } from "src/modules/employee/constraints/employee.exist.constraint";

/**
 * Input for to filter a new a Career Path
 */
export class MedicalVisitFilterArgInput extends DatabaseFilterArg {

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
        each: true,
    })
    public employeeIds?: number[];

    /**
     * The employe id
    */
    @IsOptional()
    @IsInt()
    @Validate(DepartmentExistConstraint, {

    })
    public serviceId?: number;
    
    /**
      * The employees id
     */
    @IsOptional()
    @IsInt()
    @Validate(DepartmentExistConstraint, {
        each: true,
    })
    public serviceIds?: number[];

}