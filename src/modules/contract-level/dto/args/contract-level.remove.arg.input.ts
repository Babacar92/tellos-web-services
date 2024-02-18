import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { ContractLevelEntity } from "src/entities/psql/ContractLevelEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractLevelExistConstraint } from "../../constraints/contract-level.exist.constraint";

/**
 * Input for to remove a new Employee Contract Level
 */
export class ContractLevelRemoveArgInput {

    /**
     * Id of level contract
     */
    @Validate(ContractLevelExistConstraint, {

    })
    @Transform(({ value }) => ContractLevelEntity.init(value))
    public id?: number | ContractLevelEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}