import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class AdminDocumentColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public createdAt_c?: string;

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
    public category_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public createdBy_c?: string;
}