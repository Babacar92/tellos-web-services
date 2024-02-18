import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class BusinessBatchStatusFilterArgInput extends DatabaseFilterArg {

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

}