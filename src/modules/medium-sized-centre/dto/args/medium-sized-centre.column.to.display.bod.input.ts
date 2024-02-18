import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class MediumSizedCentreColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public label_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public code_c?: string;
}