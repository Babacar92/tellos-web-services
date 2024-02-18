// NestJS
import { Field, InputType, Int } from '@nestjs/graphql';

// Validators
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';

// Schemas
import { LoginEntity } from '@Entities/LoginEntity';
import { Supplier } from '@/entities/psql/supplier.entity';

// Constraint
import { Expose, Transform } from 'class-transformer';
import { SupplierAgencyNotExistByColumnConstraint } from '../../constraints/supplier-agency.not.exist.by.column.constraints';
import { ExistByIdConstraint } from '@/common/constraints/exist-by-id.constraint';
// import { SupplierExistConstraint } from "src/modules/group-supplier/supplier/constraints/supplier.exist.constraint";

@InputType()
export class SupplierAgencyCreateInput {
    @IsString()
    @Field()
    @Validate(SupplierAgencyNotExistByColumnConstraint, {})
    public name!: string;

    @IsString()
    @Field()
    public address!: string;

    @IsOptional()
    @IsString()
    @Field()
    public addressBis: string;

    @IsString()
    @Field()
    public postcode!: string;

    @IsString()
    @Field()
    public city!: string;

    @IsString()
    @Field()
    public country!: string;

    @IsOptional()
    @IsString()
    @Field()
    public phone?: string;

    @IsOptional()
    @IsString()
    @Field()
    public fax?: string;

    @Validate(ExistByIdConstraint, [Supplier])
    @Field((type) => Int)
    @Transform(({ value }) => Supplier.init(value))
    @Expose({ name: 'supplier' })
    public supplierId!: number;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
