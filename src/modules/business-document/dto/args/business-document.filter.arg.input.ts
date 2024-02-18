import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class BusinessDocumentFilterArgInput extends DatabaseFilterArg {

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

}