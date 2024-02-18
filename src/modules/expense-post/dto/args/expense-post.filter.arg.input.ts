import { IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new ExpensePost
 */
export class ExpensePostFilterArgInput extends DatabaseFilterArg {

    /**
     * The target name for filter ExpensePost
     */
    @IsOptional()
    @IsString()
    public name?: string;

    /**
     * The target names for filter ExpensePost
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public names?: string[];

}