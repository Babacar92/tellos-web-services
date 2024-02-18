import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { CustomerTimelineTypeEnum } from "../enum/customer-timeline.type.enum";
import { Transform } from "class-transformer";

/**
 * Input for to filter a new Quick Access
 */
export class CustomerTimelineFilterArgInput extends DatabaseFilterArg {

    /**
     * The target customer id
     */
    @IsOptional()
    @IsInt()
    public customerId?: number;

    /**
     * The target customer id
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public customerIds?: number[];

    /**
     * Type
     */
    @IsOptional()
    @IsEnum(CustomerTimelineTypeEnum, {
    })
    public type?: CustomerTimelineTypeEnum;

    /**
     * Types
     */
    @IsOptional()
    @IsEnum(CustomerTimelineTypeEnum, {
        each: true,
    })
    public types?: CustomerTimelineTypeEnum[];

    /**
     * Done
     */
    @IsOptional()
    @IsBoolean()
    public isTodo?: boolean;

    /**
     * Done
     */
    @IsOptional()
    @IsBoolean()
    public done?: boolean;

    /**
     * dateFrom
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateFrom?: Date;

    /**
     * dateTo
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateTo?: Date;

}