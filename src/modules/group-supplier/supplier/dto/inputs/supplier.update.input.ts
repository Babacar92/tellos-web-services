import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
import { NotExistByColumnConstraint } from '@/common/constraints/not-exist-by-column.constraint';
import { SupplierCategoryEntity } from '@/entities/psql/SupplierCategoryEntity';
import { SupplierLanguageCodeEntity } from '@/entities/psql/SupplierLanguageCodeEntity';
import { Supplier } from '@/entities/psql/supplier.entity';
import { InputType, Field, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
    IsNumber,
    IsString,
    IsDateString,
    IsOptional,
    IsUrl,
    IsNotEmpty,
    Validate,
} from 'class-validator';

@InputType('SupplierUpdateInput')
export class SupplierUpdateInput {
    @IsNotEmpty()
    @IsNumber()
    @Field((type) => Int)
    public id!: number;

    @IsString()
    @IsOptional()
    @Field()
    @Validate(NotExistByColumnConstraint, [Supplier])
    name?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    address?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    addressBis?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    zipCode?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    city?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    country?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Validate(ExistByIdConstraint, [SupplierCategoryEntity])
    @Transform(({ value }) => SupplierCategoryEntity.init(value))
    category?: SupplierCategoryEntity;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Validate(ExistByIdConstraint, [SupplierLanguageCodeEntity])
    @Transform(({ value }) => SupplierLanguageCodeEntity.init(value))
    languageCode?: SupplierLanguageCodeEntity;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    observation?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    phone?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    fax?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    email?: string;

    @IsUrl()
    @IsOptional()
    @Field(() => String, { nullable: true })
    website?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    @Validate(NotExistByColumnConstraint, [Supplier])
    siret?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    ape?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    @Validate(NotExistByColumnConstraint, [Supplier])
    vat?: string;

    @IsNumber()
    @IsOptional()
    @Field(() => Int, { nullable: true })
    accountBalance?: number;

    @IsNumber()
    @IsOptional()
    @Field(() => Int, { nullable: true })
    orderBook?: number;

    @IsNumber()
    @IsOptional()
    @Field(() => Int, { nullable: true })
    nonInvoicedDelivery?: number;

    @IsNumber()
    @IsOptional()
    @Field(() => Int, { nullable: true })
    totalOutStanding?: number;

    @IsNumber()
    @IsOptional()
    @Field(() => Int, { nullable: true })
    authorizedOutStanding?: number;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    collectiveAccount?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    clientName?: string;

    @IsDateString()
    @IsOptional()
    @Field(() => Date, { nullable: true })
    orderDate?: Date;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    orderNumber?: string;
}
