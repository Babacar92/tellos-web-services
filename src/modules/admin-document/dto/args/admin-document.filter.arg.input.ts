import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class AdminDocumentFilterArgInput extends DatabaseFilterArg {

    /**
     * The target name for filter
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target names for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public categories?: number[];

}