import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class MediumSizedCentreFilterArgInput extends DatabaseFilterArg {

    /**
     * The target code for filter
     */
    @IsOptional()
    @IsString()
    public code?: string;

    /**
     * The target codes for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public codes?: string[];

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public labels?: string[];

}