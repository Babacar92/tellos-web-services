// NestJS
import { Field, InputType, Int } from "@nestjs/graphql";
// Validators
import { IsNumber, IsOptional, Validate } from "class-validator";
// Libs
import { REMOVE_TYPES } from "@Libs/databases/dto/types/databases.type";
import { RemoveTypeItemValidate } from "@Libs/databases/decorators/validators/RemoveTypeItemValidate";
// Constraints
import { SupplierEvaluationExistConstraint } from "../../constraints/supplier-evaluation.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
@InputType()
export class SupplierEvaluationRemoveInput {
    @Validate(SupplierEvaluationExistConstraint, {})
    @IsNumber()
    @Field((type) => Int)
    public id!: number;


    @IsOptional()
    @RemoveTypeItemValidate()
    @Field((type) => String)
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}