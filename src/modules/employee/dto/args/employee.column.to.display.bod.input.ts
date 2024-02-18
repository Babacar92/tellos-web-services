import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class EmployeeColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public lastname?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public firstname?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public entity?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public position?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public category?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public email?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public phone?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public state?: string;
}