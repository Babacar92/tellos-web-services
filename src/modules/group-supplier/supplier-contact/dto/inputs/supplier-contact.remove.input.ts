// NestJS
import { Field, InputType, Int } from "@nestjs/graphql";
// Validators
import { IsNumber, IsOptional, Validate } from "class-validator";
// Libs
import { REMOVE_TYPES } from "@Libs/databases/dto/types/databases.type";
import { RemoveTypeItemValidate } from "@Libs/databases/decorators/validators/RemoveTypeItemValidate";
// Constraints
import { ExistByIdConstraint } from "@/common/constraints/exist-by-id.constraint";
import { SupplierContact } from "@/entities/psql/supplier-contact.entity";

/**
 * Input for to create a new Quick Access
 */
@InputType()
export class SupplierContactRemoveInput {
    @Validate(ExistByIdConstraint, [SupplierContact])
    @IsNumber()
    @Field((type) => Int)
    public id!: number;


    @IsOptional()
    @RemoveTypeItemValidate()
    @Field((type) => String)
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}