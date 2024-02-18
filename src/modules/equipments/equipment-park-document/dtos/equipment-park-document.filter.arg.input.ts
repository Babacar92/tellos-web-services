import { IsArray, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';
import { DatabaseFilterArg } from '@/libs/databases/dto/args/database.filter.arg';

@InputType()
export class EquipmentParkDocumentFilterInput extends DatabaseFilterArg {
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
    typeId?: number;

    @IsOptional()
    @IsArray()
    @Field((type) => [Int], { nullable: true })
    typeIds?: number[];

    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    userId?: number;

    @IsOptional()
    @IsArray()
    @Field((type) => [Int], { nullable: true })
    userIds?: number[];

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
