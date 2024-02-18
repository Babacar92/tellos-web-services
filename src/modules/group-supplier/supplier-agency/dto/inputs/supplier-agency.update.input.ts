// NestJS
import { Field, InputType, Int } from '@nestjs/graphql';

// Validators
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';

// Schemas
import { Supplier } from '@/entities/psql/supplier.entity';

// Constraint
import { SupplierAgencyExistConstraint } from '../../constraints/supplier-agency.exist.constraint';
import { Expose, Transform } from 'class-transformer';
import { SupplierAgencyNotExistByColumnConstraint } from '../../constraints/supplier-agency.not.exist.by.column.constraints';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
// import { SupplierExistConstraint } from "src/modules/group-supplier/supplier/constraints/supplier.exist.constraint";

@InputType()
export class SupplierAgencyUpdateInput {
    @IsNotEmpty()
    @IsNumber()
    @Field((type) => Int)
    @Validate(SupplierAgencyExistConstraint, {})
    public id!: number;

    @IsString()
    @Field()
    @Validate(SupplierAgencyNotExistByColumnConstraint, {})
    @IsOptional()
    public name!: string;

    @IsString()
    @IsOptional()
    @Field()
    public address!: string;

    @IsOptional()
    @IsString()
    @Field()
    public addressBis?: string;

    @IsString()
    @Field()
    @IsOptional()
    public postcode!: string;

    @IsString()
    @Field()
    @IsOptional()
    public city!: string;

    @IsString()
    @Field()
    @IsOptional()
    public country!: string;

    @IsOptional()
    @IsString()
    @Field()
    @IsOptional()
    public phone?: string;

    @IsOptional()
    @IsString()
    @Field()
    @IsOptional()
    public fax?: string;

    @Field((type) => Int)
    @Transform(({ value }) => Supplier.init(value))
    @Validate(ExistByIdConstraint, [Supplier])
    @IsOptional()
    @Expose({ name: 'supplier' })
    public supplierId!: number;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
