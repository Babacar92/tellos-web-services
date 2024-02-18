import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { ContractCommentEntity } from "src/entities/psql/ContractCommentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { ContractCommentExistConstraint } from "../../constraints/contract-comment.exist.constraint";

/**
 * Input for to create a new Comment Contract
 */
export class ContractCommentRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(ContractCommentExistConstraint, {

    })
    @Transform(({ value }) => ContractCommentEntity.init(value))
    public id?: number | ContractCommentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}