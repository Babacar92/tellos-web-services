import { IsEnum, IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { EmployeeExistConstraint } from "src/modules/employee/constraints/employee.exist.constraint";
import { CAREER_ICON_PATH } from "../enums/career-path.icon.enum";

/**
 * Input for to filter a new a Career Path
 */
export class CareerPathFilterArgInput extends DatabaseFilterArg {

    /**
     * The target title for filter career path
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target titles for filter Career Path
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public titles?: string[];

    /**
     * The employe id
    */
    @IsOptional()
    @IsInt()
    public employeeId?: number;

    /**
     * The employees id
    */
    @IsOptional()
    @IsInt()
    public employeeIds?: number[];

    /**
     * The icon
     */
    @IsOptional()
    @IsEnum(CAREER_ICON_PATH, {

    })
    public icon?: CAREER_ICON_PATH;

    /**
     * The icon
     */
    @IsOptional()
    @IsEnum(CAREER_ICON_PATH, {
        each: true,
    })
    public icons?: CAREER_ICON_PATH[];

}