import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class RegulationCodeFilterArgInput extends DatabaseFilterArg {

    /**
     * The target title for filter
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target titles for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public titles?: string[];

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

}