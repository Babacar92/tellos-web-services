import { IsInt, IsOptional } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Comment Contract
 */
export class ContractCommentFilterArgInput extends DatabaseFilterArg {

    /**
     * The employe id
     */
    @IsOptional()
    @IsInt()
    public employeeId?: number;

    /**
     * The employe id
     */
    @IsOptional()
    @IsInt()
    public employeeIds?: number[];

    /**
     * The contract id
     */
    @IsOptional()
    @IsInt()
    public contractId?: number;

    /**
     * Contract id
     */
    @IsOptional()
    @IsInt()
    public contractIds?: number[];

}