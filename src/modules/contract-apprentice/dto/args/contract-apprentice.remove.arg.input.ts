import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { ContractApprenticeEntity } from "src/entities/psql/ContractApprenticeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractApprenticeExistConstraint } from "../../constraints/contract-apprentice.exist.constraint";

/**
 * Input for to remove a Employee Contract Apprentice
 */
export class ContractApprenticeRemoveArgInput {

    /**
     * Id of Employee Contract Apprentice
     */
    @Validate(ContractApprenticeExistConstraint, {

    })
    @Transform(({ value }) => ContractApprenticeEntity.init(value))
    public id?: number | ContractApprenticeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}