import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
import { SupplierContact } from '@/entities/psql/supplier-contact.entity';
import { Supplier } from '@/entities/psql/supplier.entity';
import { InputType, Field, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsNumber, Validate } from 'class-validator';

@InputType('SupplierContactUpdateInput')
export class SupplierContactUpdateInput {
    @IsNotEmpty()
    @IsNumber()
    @Field((type) => Int)
    @Validate(ExistByIdConstraint, [SupplierContact])
    public id!: number;

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
