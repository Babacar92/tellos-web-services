import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class TheoreticalHoursOfUseFilterArgInput extends DatabaseFilterArg {

    /**
     * The target name for filter
     */
    @IsOptional()
    @IsString()
    public year?: string;

    /**
     * The target names for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public years?: string[];

    /**
     * The target validity for filter
     */
    @IsOptional()
    @IsInt()
    public hoursNumber?: number;

    /**
     * The target validities for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public hoursNumbers?: number[];
}