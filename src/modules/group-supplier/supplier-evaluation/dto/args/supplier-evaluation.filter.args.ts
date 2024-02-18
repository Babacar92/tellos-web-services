import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from '@Libs/databases/dto/args/database.filter.arg';
import { Expose, Transform } from 'class-transformer';

/**
 * Input for to filter a new Quick Access
 */
@InputType()
export class SupplierEvaluationFilterArgs extends DatabaseFilterArg {
    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    @Expose({ name: 'supplier' })
    public supplierId?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    public loginId?: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    public comment?: string;

    @IsOptional()
    @IsInt()
    @Field((type) => Int, { nullable: true })
    public note?: number;

    @IsOptional()
    @IsInt({
        each: true,
    })
    @Field((type) => Int, { nullable: true })
    @Transform(({ value }) => {
        return value && value.length == 0 ? null : value;
    })
    public notes?: number;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field({ nullable: true })
    public startDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field({ nullable: true })
    public endDate?: Date;
}
