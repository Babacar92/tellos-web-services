import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class QualificationColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public employee_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public number_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public type_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public qualification_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public delivery_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public validity_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public deadline_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public comment_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public status_c?: string;
}