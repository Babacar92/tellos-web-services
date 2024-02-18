import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class CustomerColumnToDisplayBodInput {
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
    public typology_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public name_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public address_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public phone_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public state_c?: string;
}