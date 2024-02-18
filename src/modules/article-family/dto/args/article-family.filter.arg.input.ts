import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { Transform } from 'class-transformer';
import { Employee } from '@/entities/psql/EmployeeEntity';

/**
 * Input for to filter a new Article Family
 */
export class ArticleFamilyFilterArgInput extends DatabaseFilterArg {
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
     * The target section code for filters
     */
    @IsOptional()
    @IsInt()
    public sectionCode?: number;

    /**
     * The target section codes for filters
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public sectionCodes?: number[];

    /**
     * The family is available to be a child family
     */
    @IsOptional()
    @IsBoolean()
    public availableForChild?: boolean;

    /**
     * The family is available to be a parent family
     */
    @IsOptional()
    @IsBoolean()
    public availableForParent?: boolean;

    /**
     * Id of Items
     */
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    public parentId?: number;

    /**
     * Id of Items
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    @Transform(({ value }) => {
        if (value instanceof Array) {
            return value.map((v) => parseInt(v));
        }
    })
    public parentIds?: number[];
}
