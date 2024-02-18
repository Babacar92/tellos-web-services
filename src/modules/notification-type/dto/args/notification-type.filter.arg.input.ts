import { IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class NotificationTypeFilterArgInput extends DatabaseFilterArg {

    /**
     * The login id of current user
     */
    public targetLogin?: number;

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
     * The target icon for filter
     */
    @IsOptional()
    @IsString()
    public icon?: string;

    /**
     * The target icons for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public icons?: string[];

}