import {  IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Employee Contract Type Entry
 */
export class ContractTypePaymentFilterArgInput extends DatabaseFilterArg {

    /**
     * The target title for filter Employee Contract Type Payment
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target titles for filter Employee Contract Type Payment
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public titles?: string[];

}