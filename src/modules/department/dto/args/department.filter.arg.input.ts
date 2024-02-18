import { IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
export class DepartmentFilterArgInput extends DatabaseFilterArg {
    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public name?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public names?: string[];
}
