import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Employee Contract Type Entry
 */
export class ContractTypeEntryFilterArgInput extends DatabaseFilterArg {

    /**
     * The target title for filter Employee Contract Type Entry
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target titles for filter Employee Contract Type Entry
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public titles?: string[];

}