import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class DocumentCategoryColumnToDisplayBodInput {
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
    public icon_c?: string;
}