import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { Employee } from '../../../../entities/psql/EmployeeEntity';
import { CONTRACT_CATEGORY_ENUM } from 'src/modules/contract/dto/enums/contract.category.enum';

/**
 * Input for to filter a new Quick Access
 */
export class ParagraphFrameFilterArgInput extends DatabaseFilterArg {
    /**
     * The target employee for filter
     */
    public employee?: number | Employee;

    /**
     * The target title for filter
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
     * The target titles for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public titles?: string[];

    /**
     * The target content for filter
     */
    @IsOptional()
    @IsString()
    public content?: string;

    /**
     * The target contents for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public contents?: string[];

    /**
     * The target category for filter
     */
    @IsOptional()
    @IsEnum(CONTRACT_CATEGORY_ENUM, {})
    public category?: CONTRACT_CATEGORY_ENUM;

    /**
     * The target categories for filter
     */
    @IsOptional()
    @IsEnum(CONTRACT_CATEGORY_ENUM, {
        each: true,
    })
    public categories?: CONTRACT_CATEGORY_ENUM[];
}
