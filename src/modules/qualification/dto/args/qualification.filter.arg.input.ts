import { IsEnum, IsIn, IsInt, IsOptional, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { EmployeeSexEnum } from "src/modules/employee/dto/enums/employee.sexe.enum";
import { QualificationStatusEnum } from "../enums/qualification.status.enum";

/**
 * Input for to filter a new Quick Access
 */
export class QualificationFilterArgInput extends DatabaseFilterArg {

    /**
     * The target entity for filter
     */
    @IsOptional()
    @IsInt()
    public entity?: number;

    /**
     * The target entities for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public entities?: number[];

    /**
     * The target department for filter
     */
    @IsOptional()
    @IsInt({
    })
    public department?: number;

    /**
     * The target entities for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public departments?: number[];

    /**
     * The target type for filter
     */
    @IsOptional()
    @IsInt({
    })
    public type?: number;

    /**
     * The target types for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public types?: number[];

    /**
     * The target name for filter
     */
    @IsOptional()
    @IsInt({
    })
    public name?: number;

    /**
     * The target names for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public names?: number[];

    /**
     * The target gender
     */
    @IsOptional()
    @IsEnum(EmployeeSexEnum)
    public sexe?: EmployeeSexEnum;

    /**
     * The target genders
     */
    @IsOptional()
    @IsEnum(EmployeeSexEnum, {
        each: true,
    })
    public sexes?: EmployeeSexEnum[];

    /**
     * The target status
     */
    @IsOptional()
    @IsEnum(EmployeeSexEnum)
    public status?: QualificationStatusEnum;

    /**
     * The target statuses
     */
    @IsOptional()
    @IsEnum(EmployeeSexEnum, {
        each: true,
    })
    public statuses?: QualificationStatusEnum[];

    /**
     * The employe id
     */
    @IsOptional()
    @IsInt()
    public employeeId?: number;

    /**
     * The employe id
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public employeeIds?: number[];

}