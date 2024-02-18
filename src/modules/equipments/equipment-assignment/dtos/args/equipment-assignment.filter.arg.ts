import { IsArray, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';
import { DatabaseFilterArg } from '@/libs/databases/dto/args/database.filter.arg';

@InputType()
export class EquipmentParkAssignmentFilterArg extends DatabaseFilterArg {
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
