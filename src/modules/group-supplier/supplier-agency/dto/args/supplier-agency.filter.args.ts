import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from '@Libs/databases/dto/args/database.filter.arg';
import { Expose } from 'class-transformer';

/**
 * Input for to filter a new Quick Access
 */
@InputType()
export class SupplierAgencyFilterArgs extends DatabaseFilterArg {
    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    @Expose({ name: 'supplier' })
    public supplierId?: number;

    @IsOptional()
    @IsString()
    @Field()
    public search?: string;

    @IsOptional()
    @IsString()
    @Field()
    public name?: string;

    @IsOptional()
    @IsString()
    @Field()
    public address?: string;

    @IsOptional()
    @IsString()
    @Field()
    public addressBis?: string;

    @IsOptional()
    @IsString()
    @Field()
    public postcode?: string;

    @IsOptional()
    @IsString()
    @Field()
    public city?: string;

    @IsOptional()
    @IsString()
    @Field()
    public country?: string;

    @IsOptional()
    @IsString()
    @Field()
    public phone?: string;

    @IsOptional()
    @IsString()
    @Field()
    public fax?: string;

    @IsOptional()
    @IsBoolean()
    @Field()
    public active?: boolean;
}
