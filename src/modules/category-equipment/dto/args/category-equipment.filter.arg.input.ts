import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new CategoryEquipment
 */
@InputType()
export class CategoryEquipmentFilterArgInput extends DatabaseFilterArg {
    /**
     * The target mediumSizedCentre for filter CategoryEquipment
     */
    @IsOptional()
    @IsInt()
    @Field((type) => Int, { nullable: true })
    public mediumSizedCentreId?: number;

    /**
     * The target mediumSizedCentreIds for filter CategoryEquipment
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    @Field((type) => [Int], { nullable: true })
    public mediumSizedCentreIds?: number[];

    /**
     * The target code for filter CategoryEquipment
     */
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    public code?: string;

    /**
     * The target code for filter CategoryEquipment
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    @Field((type) => [String], { nullable: true })
    public codes?: string[];

    /**
     * The target title for filter CategoryEquipment
     */
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    public title?: string;

    /**
     * The target titles for filter CategoryEquipment
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    @Field((type) => [String], { nullable: true })
    public titles?: string[];
}
