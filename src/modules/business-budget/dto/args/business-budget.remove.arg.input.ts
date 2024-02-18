import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessBudgetEntity } from "src/entities/psql/BusinessBudgetEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessBudgetExistConstraint } from "../../constraints/business-budget.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessBudgetRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessBudgetExistConstraint, {

    })
    @Transform(({ value }) => BusinessBudgetEntity.init(value))
    public id?: number | BusinessBudgetEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}