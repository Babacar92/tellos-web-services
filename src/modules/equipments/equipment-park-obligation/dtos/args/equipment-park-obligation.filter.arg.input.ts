import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { DatabaseFilterArg } from '@/libs/databases/dto/args/database.filter.arg';

@InputType()
export class EquipmentParkObligationFilterInput extends DatabaseFilterArg {
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
}
