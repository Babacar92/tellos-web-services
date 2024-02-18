import { IsOptional, IsString } from "class-validator";

/**
 * Input for to filter a new Quick Access
 */
export class DepartmentColumnToDisplayBodInput {
    /**
     * The target column
     */
    @IsOptional()
    @IsString()
    public service?: string;
}