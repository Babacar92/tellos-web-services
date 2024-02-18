import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
    IsString,
    IsNumber,
    IsUrl,
    IsOptional,
    IsBoolean,
    Validate,
} from 'class-validator';

//Entity
import { Supplier } from '@/entities/psql/supplier.entity';
import { Transform } from 'class-transformer';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';

@InputType('SupplierContactCreateInput')
export class SupplierContactCreateInput {

    @Field((type) => Int)
    @Transform(({ value }) => Supplier.init(value))
    @Validate(ExistByIdConstraint, [Supplier])
    supplier: Supplier;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    service?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    phone?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    mobilePhone?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    email?: string;

    @Field({ nullable: true })
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
