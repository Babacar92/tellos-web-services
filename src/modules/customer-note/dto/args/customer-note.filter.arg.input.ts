import { IsInt, IsOptional } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class CustomerNoteFilterArgInput extends DatabaseFilterArg {

    /**
     * The target customer id
     */
    @IsOptional()
    @IsInt()
    public customerId?: number;

    /**
     * The target login id
     */
    @IsOptional()
    @IsInt()
    public loginId?: number;

}