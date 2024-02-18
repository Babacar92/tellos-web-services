// NestJS
import { Field, InputType, Int } from "@nestjs/graphql";
// Validators
import { IsNumber, IsOptional, Validate } from "class-validator";
// Libs
import { REMOVE_TYPES } from "@Libs/databases/dto/types/databases.type";
import { RemoveTypeItemValidate } from "@Libs/databases/decorators/validators/RemoveTypeItemValidate";

import { Supplier } from "@/entities/psql/supplier.entity";
import { ExistByIdConstraint } from "@/common/constraints/exist-by-id.constraint";


@InputType()
export class SupplierRemoveInput {
    @IsNumber()
    @Field((type) => Int)
    @Validate(ExistByIdConstraint, [Supplier])
    public id!: number;


    @IsOptional()
    @RemoveTypeItemValidate()
    @Field((type) => String)
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}