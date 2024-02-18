import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class ContractTypeEntryColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public id_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public title_c?: string;
}