import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
    IsNumber,
    IsString,
    IsDateString,
    IsOptional,
    IsBoolean,
    IsEnum,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';

// Schemas
import { LoginEntity } from '@Entities/LoginEntity';
import { Supplier } from '@/entities/psql/supplier.entity';

// Constraint
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
import { LoginExistConstraint } from '@/modules/login/constraints/login.exist.constraint';

//Enums
import { SupplierCurrencyEnum } from '@ModuleSupplier/enums/supplier.currency.enum';
import { SupplierConditionEnum } from '@ModuleSupplier/enums/supplier.conditions.enum';
import { SupplierDeliveryModeEnum } from '@ModuleSupplier/enums/supplier.delivery-mode.enum';

@InputType('SupplierBillingCreateInput')
export class SupplierBillingCreateInput {
    @Field((type) => Int)
    @Transform(({ value }) => Supplier.init(value))
    @Validate(ExistByIdConstraint, [Supplier])
    public supplier: Supplier;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    taxCode?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    regulationCode?: string;

    @Field(() => SupplierCurrencyEnum, { nullable: true })
    @IsOptional()
    @IsEnum(SupplierCurrencyEnum)
    currency?: SupplierCurrencyEnum;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    rib?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    billingAddress?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsString()
    iban?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsString()
    bic?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    discountRate?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    bankRate?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    minOrder?: number;

    @Field(() => SupplierConditionEnum, { nullable: true })
    @IsOptional()
    @IsEnum(SupplierConditionEnum)
    condition?: SupplierConditionEnum;

    @Field(() => SupplierDeliveryModeEnum, { nullable: true })
    @IsOptional()
    @IsEnum(SupplierDeliveryModeEnum)
    deliveryMode?: SupplierDeliveryModeEnum;

    @IsOptional()
    @IsBoolean()
    @Field(() => Boolean, { nullable: true })
    creditInsurer?: boolean;

    @IsOptional()
    @IsString()
    @Field(() => String, { nullable: true })
    insurerName?: string;

    @IsOptional()
    @IsBoolean()
    @Field(() => Boolean, { nullable: true })
    intraGroup?: boolean;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
