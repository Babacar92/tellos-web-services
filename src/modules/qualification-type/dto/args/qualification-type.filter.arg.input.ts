import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class QualificationTypeFilterArgInput extends DatabaseFilterArg {

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

}