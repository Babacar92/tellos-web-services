import { PartialType } from '@nestjs/mapped-types';
import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
    IsNumber,
    Validate,
    IsNotEmpty,
    IsString,
    IsDateString,
    IsOptional,
    IsBoolean,
    IsEnum,
} from 'class-validator';

//Inputs
import { SupplierBillingCreateInput } from './supplier-billing.create.input';

//Constraints
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
import { SupplierBilling } from '@/entities/psql/supplier-billing.entity';

@InputType('SupplierBillingUpdateInput')
export class SupplierBillingUpdateInput extends PartialType(
    SupplierBillingCreateInput,
) {
    @IsNotEmpty()
    @IsNumber()
    @Field((type) => Int)
    @Validate(ExistByIdConstraint, [SupplierBilling])
    public id!: number;
}
