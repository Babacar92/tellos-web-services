import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';
import { DatabaseFilterArg } from '@/libs/databases/dto/args/database.filter.arg';
import { EquipmentTypeEnum } from '../../enums/equipment.type.enum';

@InputType()
export class EquipmentParkFilterInput extends DatabaseFilterArg {
    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    categoryId?: number;

    @IsOptional()
    @IsArray()
    @Field((type) => [Int], { nullable: true })
    categoryIds?: number[];

    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    entityId?: number;

    @IsOptional()
    @IsArray()
    @Field((type) => [Int], { nullable: true })
    entityIds?: number[];

    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    employeeId?: number;

    @IsOptional()
    @IsArray()
    @Field((type) => [Int], { nullable: true })
    employeeIds?: number[];

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public registrationDate?: Date;

    @IsOptional()
    @IsEnum(EquipmentTypeEnum)
    type: EquipmentTypeEnum;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsBoolean()
    available?: boolean;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    startDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    endDate?: Date;
}
