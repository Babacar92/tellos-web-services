import { IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class CustomerContactFilterArgInput extends DatabaseFilterArg {

    /**
     * The target customer id
     */
    @IsOptional()
    @IsInt()
    public customerId?: number;

}