import {
    IsBoolean,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    IsDate,
    Validate,
} from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { Transform } from 'class-transformer';
/**
 * Input for to filter a new goodReferencePrice
 */
export class GoodReferencePriceFilterArgInput extends DatabaseFilterArg {
    /**
     * The target price for filter
     */
    @IsOptional()
    @IsNumber()
    public price?: number;

    @IsNumber()
    @IsOptional()
    public supplier?: number;

    /**
     * The target discount for filter
     */
    @IsOptional()
    @IsNumber()
    public discount?: number;

    /**
     * The target netPrice for filter
     */
    @IsOptional()
    @IsNumber()
    public netPrice?: number;

    /**
     * The target qty for filter
     */
    @IsOptional()
    @IsNumber()
    public qty?: number;

    /**
     * The target executiveContract for filter
     */
    @IsOptional()
    @IsBoolean()
    public executiveContract?: boolean;

    /**
     * The target entities for filter
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    @Validate(EntityExistConstraint, {
        each: true,
    })
    public entities?: number[];

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    /**
     * The target endDate for filter
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    /**
     * The target discount for filter
     */
    @IsOptional()
    @IsNumber()
    public good?: number;
}
