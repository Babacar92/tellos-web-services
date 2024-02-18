import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Employee Contract Level
 */
export class ContractLevelFilterArgInput extends DatabaseFilterArg {

    /**
     * The target title for filter Employee Contract Level
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target titles for filter Employee Contract Level
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public titles?: string[];

}