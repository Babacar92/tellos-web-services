import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class JobDescriptionColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public number?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public denomination?: string;

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
    public service?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public totalEmplyee?: string;
}