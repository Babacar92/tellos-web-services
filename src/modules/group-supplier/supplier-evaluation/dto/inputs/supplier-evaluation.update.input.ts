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
import { LoginEntity } from '@Entities/LoginEntity';
import { Supplier } from '@/entities/psql/supplier.entity';

// Constraint
import { LoginExistConstraint } from '@/modules/login/constraints/login.exist.constraint';
import { SupplierEvaluationExistConstraint } from '../../constraints/supplier-evaluation.exist.constraint';
import { Expose, Transform } from 'class-transformer';
// import { SupplierExistConstraint } from "src/modules/group-supplier/supplier/constraints/supplier.exist.constraint";

@InputType()
export class SupplierEvaluationUpdateInput {
    @IsNotEmpty()
    @IsNumber()
    @Field((type) => Int)
    @Validate(SupplierEvaluationExistConstraint, {})
    public id!: number;

    @IsOptional()
    @IsString()
    @Field()
    public comment!: string;

    @IsNumber()
    @Field((type) => Int)
    public note!: number;

    @IsOptional()
    @Validate(LoginExistConstraint, {})
    @Transform(({ value }) => LoginEntity.init(value))
    @Field((type) => Int)
    public login?: LoginEntity;

    @Field((type) => Int)
    @Transform(({ value }) => Supplier.init(value))
    @Expose({ name: 'supplier' })
    public supplierId: Supplier;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
