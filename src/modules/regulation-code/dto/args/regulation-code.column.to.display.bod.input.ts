import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class RegulationCodeColumnToDisplayBodInput {
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
    public title_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public immediateDays_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public specificity_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public paymentDays_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public additionnalDays_c?: string;
}