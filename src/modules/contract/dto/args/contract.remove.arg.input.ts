import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractExistConstraint } from "../../constraints/contract.exist.constraint";
import { ContractEntity } from "src/entities/psql/ContractEntity";

/**
 * Input for to remove a Contract Preview
 */
export class ContractRemoveArgInput {

    /**
     * Id 
     */
    @Validate(ContractExistConstraint, {

    })
    @Transform(({ value }) => ContractEntity.init(value))
    public id?: number | ContractEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}