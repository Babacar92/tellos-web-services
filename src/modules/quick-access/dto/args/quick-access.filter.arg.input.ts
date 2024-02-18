import { IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { Employee } from '../../../../entities/psql/EmployeeEntity';

/**
 * Input for to filter a new Quick Access
 */
export class QuickAccessFilterArgInput extends DatabaseFilterArg {
    /**
     * The target employee for filter
     */
    public employee?: number | Employee;

    /**
     * The target label for filter
     */
    @IsOptional()
    @IsString()
    public label?: string;

    /**
     * The target labels for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public labels?: string[];

    /**
     * The target link for filter
     */
    @IsOptional()
    @IsString()
    public link?: string;

    /**
     * The target links for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public links?: string[];

    /**
     * The target color for filter
     */
    @IsOptional()
    @IsString()
    public color?: string;

    /**
     * The target colors for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public colors?: string[];
}
