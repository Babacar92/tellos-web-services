import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Employee Contract Sectino
 */
export class ContractSectionFilterArgInput extends DatabaseFilterArg {

    /**
     * The target title for filter Employee Contract Section
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target titles for filter Employee Contract Section
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public titles?: string[];

}