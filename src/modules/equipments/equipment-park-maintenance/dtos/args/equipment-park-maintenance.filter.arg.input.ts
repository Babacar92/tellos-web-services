import { IsArray, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { DatabaseFilterArg } from '@/libs/databases/dto/args/database.filter.arg';
import { Transform } from 'class-transformer';

@InputType()
export class EquipmentParkMaintenanceFilterInput extends DatabaseFilterArg {
    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    equipmentParkId?: number;

    @IsOptional()
    @IsArray()
    @Field((type) => [Int], { nullable: true })
    equipmentParkIds?: number[];

    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    categoryId?: number;

    @IsOptional()
    @IsArray()
    @Field((type) => [Int], { nullable: true })
    categoryIds?: number[];

    //
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;
}
