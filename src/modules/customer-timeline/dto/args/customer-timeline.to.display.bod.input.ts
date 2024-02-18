import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class CustomerTimelineColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public startDate_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public client_c?: string;

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
    public title_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public description_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public file_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public realise_c?: string;
}