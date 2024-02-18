import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class DocumentTypeFilterArgInput extends DatabaseFilterArg {

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
     * The target category for filter
     */
    @IsOptional()
    @IsInt({

    })
    public category?: number;

    /**
     * The target categories for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public categories?: number[];

    /**
     * The target category title for filter
     */
    @IsOptional()
    @IsString()
    public categoryTitle?: string;

    /**
     * The target categories titles for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public categoryTitles?: string[];

}