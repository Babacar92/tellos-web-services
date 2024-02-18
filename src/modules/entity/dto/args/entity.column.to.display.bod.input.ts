import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class EntityColumnToDisplayBodInput {
    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public ID?: string;

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public logo?: string;

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public entity?: string;
}