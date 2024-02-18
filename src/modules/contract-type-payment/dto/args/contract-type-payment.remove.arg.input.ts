import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractTypePaymentExistConstraint } from "../../constraints/contract-type-payment.exist.constraint";
import { ContractTypePaymentEntity } from "src/entities/psql/ContractTypePaymentEntity";

/**
 * Input for to remove a new Employee Contract Type  Payment
 */
export class ContractTypePaymentRemoveArgInput {

    /**
     * Id of type entry contract
     */
    @Validate(ContractTypePaymentExistConstraint, {

    })
    @Transform(({ value }) => ContractTypePaymentEntity.init(value))
    public id?: number | ContractTypePaymentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}