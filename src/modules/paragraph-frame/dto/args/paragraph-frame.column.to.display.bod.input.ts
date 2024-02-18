import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class ParagraphFrameColumnToDisplayBodInput {
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
    public title_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public updatedAt_c?: string;

    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public user_c?: string;
}