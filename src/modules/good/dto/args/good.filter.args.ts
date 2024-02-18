import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Good
 */
export class GoodFilterArgInput extends DatabaseFilterArg {
    /**
     * The target id for filter
     */
    @IsOptional()
    @IsInt()
    public id?: number;

    /**
     * The target ids list for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public ids?: number[];

    /**
     * The target name for filter
     */
    @IsOptional()
    @IsString()
    public name?: string;

    /**
     * The target names for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public names?: string[];

    /**
     * The target nameBis for filter
     */
    @IsOptional()
    @IsString()
    public nameBis?: string;

    /**
     * The target nameBises for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public nameBises?: string[];

    /**
     * The target section code ids list for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public sectionCodeIds?: number[];

    /**
     * The target family ids list for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public familyIds?: number[];

    /**
     * The target family ids list for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public subFamilyIds?: number[];

    //Supplier
    @IsOptional()
    @IsNumber()
    @Expose({ name: 'supplier' })
    public supplierId?: number;
}
