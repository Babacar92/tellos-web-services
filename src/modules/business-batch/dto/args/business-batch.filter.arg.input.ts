import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class BusinessBatchFilterArgInput extends DatabaseFilterArg {

    /**
     * The target apology for filter
     */
    @IsOptional()
    @IsString()
    public apology?: string;

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

    /**
     * Business id
     */
    @IsOptional()
    @IsInt()
    public businessId?: number;

    /**
     * Business ids
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public businessIds?: number[];

    /**
     * Statuses ids
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public statusesIds?: number[];

}