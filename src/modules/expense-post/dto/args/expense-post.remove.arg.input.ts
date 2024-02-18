import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { ExpensePostEntity } from "src/entities/psql/ExpensePostEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ExpensePostExistConstraint } from "../../constraints/expense-post.exist.constraint";

/**
 * Input for to remove ExpensePost
 */
export class ExpensePostRemoveArgInput {

    /**
     * Id of Expense Post
     */
    @Validate(ExpensePostExistConstraint, {

    })
    @Transform(({ value }) => ExpensePostEntity.init(value))
    public id?: number | ExpensePostEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}