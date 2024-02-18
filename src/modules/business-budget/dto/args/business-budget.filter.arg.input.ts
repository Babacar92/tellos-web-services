import { IsInt, IsOptional } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class BusinessBudgetFilterArgInput extends DatabaseFilterArg {

    /**
     * The business
     */
    @IsOptional()
    @IsInt()
    public business?: number;

    /**
     * The business
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public businesses?: number[];

}