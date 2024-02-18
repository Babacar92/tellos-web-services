import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class SectionCodeColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public code_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public designation_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public purchaseAccount_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public inventoryChange_c?: string;
}