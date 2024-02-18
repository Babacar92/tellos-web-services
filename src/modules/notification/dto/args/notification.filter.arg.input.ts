import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class NotificationFilterArgInput extends DatabaseFilterArg {

    /**
     * The target category for filter
     */
    @IsOptional()
    @IsString()
    public category?: string;

    /**
     * The target categories for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public categories?: string[];

    /**
     * The target loginId for filter
     */
    @IsOptional()
    @IsInt()
    public loginId?: number;

    /**
     * The target loginIds for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public loginIds?: number[];

    /**
     * The target typeId for filter
     */
    @IsOptional()
    @IsInt()
    public typeId?: number;

    /**
     * The target typeIds for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public typeIds?: number[];

    /**
     * The target typeTitle for filter
     */
    @IsOptional()
    @IsString()
    public typeTitle?: string;

    /**
     * The target typeTitles for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public typeTitles?: string[];

}