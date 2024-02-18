import {
    IsBoolean,
    IsOptional,
    IsNumber,
    IsDate,
    IsDateString,
    IsArray,
} from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SupplierMaterialPricingFilterArgs extends DatabaseFilterArg {
    @IsArray()
    @IsNumber({}, { each: true })
    public entities?: number[];

    @IsDateString()
    @IsOptional()
    public order_start_date?: Date;

    @IsDateString()
    @IsOptional()
    public order_end_date?: Date;
}
