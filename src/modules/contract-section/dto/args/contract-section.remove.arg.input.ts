import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { ContractSectionEntity } from "src/entities/psql/ContractSectionEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractSectionExistConstraint } from "../../constraints/contract-section.exist.constraint";

/**
 * Input for to remove a new Employee Contract Section
 */
export class ContractSectionRemoveArgInput {

    /**
     * Id of section contract
     */
    @Validate(ContractSectionExistConstraint, {

    })
    @Transform(({ value }) => ContractSectionEntity.init(value))
    public id?: ContractSectionEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}