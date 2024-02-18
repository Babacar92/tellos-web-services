import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class BusinessColumnToDisplayBodInput {
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
    public code_c?: string;

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
    public maitreOuvrage_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public montantEstime_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public typeAppelOffre_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public typeMarche_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public dateLimite_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public status_c?: string;
}