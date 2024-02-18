import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class DocumentTypeColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public denomination_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public category_c?: string;
}