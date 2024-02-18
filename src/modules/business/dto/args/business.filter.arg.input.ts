import { IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsOptional } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { BusinessStatusEnum } from "../enums/business-status.enum";
import { BusinessTypeEnum } from "../enums/business-type.enum";
import { Transform } from "class-transformer";

/**
 * Input for to filter a new Quick Access
 */
export class BusinessFilterArgInput extends DatabaseFilterArg {

    /**
     * The customerId
     */
    @IsOptional()
    @IsInt()
    public customerId?: number;

    /**
     * The customerIds
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public customerIds?: number[];

    /**
     * The statuses
     */
    @IsOptional()
    @IsEnum(BusinessStatusEnum, {
        each: true,
    })
    public statuses?: BusinessStatusEnum[];

    /**
     * The types
     */
    @IsOptional()
    @IsEnum(BusinessTypeEnum, {
        each: true,
    })
    public types?: BusinessTypeEnum[];

    /**
     * The tenderTypes
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public tenderTypes?: number[];

    /**
     * The marketTypes
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public marketTypes?: number[];

    /**
     * the dateLimiteFrom
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateLimiteFrom?: Date;

    /**
     * the dateLimiteTo
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateLimiteTo?: Date;

    /**
     * The estimatedAmountFrom
     */
    @IsOptional()
    @IsNumber()
    public estimatedAmountFrom?: number;

    /**
     * The estimatedAmountTo
     */
    @IsOptional()
    @IsNumber()
    public estimatedAmountTo?: number;

    /**
     * The isEditable
     */
    @IsOptional()
    @IsBoolean()
    public isEditable?: boolean;

    /**
     * The isEditable
     */
    @IsOptional()
    @IsBoolean({
        each: true,
    })
    public isEditables?: boolean[];

}