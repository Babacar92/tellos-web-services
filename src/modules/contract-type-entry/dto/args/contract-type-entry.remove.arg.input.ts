import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { ContractTypeEntryEntity } from "src/entities/psql/ContractTypeEntryEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractTypeEntryExistConstraint } from "../../constraints/contract-type-entry.exist.constraint";

/**
 * Input for to remove a new Employee Contract Type Entry
 */
export class ContractTypeEntryRemoveArgInput {

    /**
     * Id of type entry contract
     */
    @Validate(ContractTypeEntryExistConstraint, {

    })
    @Transform(({ value }) => ContractTypeEntryEntity.init(value))
    public id?: number | ContractTypeEntryEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}