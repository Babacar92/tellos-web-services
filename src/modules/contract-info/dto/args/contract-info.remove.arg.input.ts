import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractInfoExistConstraint } from "../../constraints/contract-info.exist.constraint";
import { ContractInfoEntity } from "src/entities/psql/ContractInfoEntity";

/**
 * Input for to remove a Employee Contract
 */
export class ContractRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(ContractInfoExistConstraint, {

    })
    @Transform(({ value }) => ContractInfoEntity.init(value))
    public id?: number | ContractInfoEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}