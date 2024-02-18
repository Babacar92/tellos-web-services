import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';

@InputType('SupplierLanguageCodeUpdateInput')
export class SupplierLanguageCodeUpdateInput {
    /**
     * The id of supplier category
     */
    @IsNotEmpty()
    @IsInt()
    @Field(() => Int)
    public id: number;

    @IsString()
    @Field()
    @IsOptional()
    code?: string;

    @IsString()
    @Field()
    @IsOptional()
    name?: string;
}
