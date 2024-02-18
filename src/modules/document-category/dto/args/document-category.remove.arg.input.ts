import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { DocumentCategoryEntity } from "src/entities/psql/DocumentCategoryEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { DocumentCategoryExistConstraint } from "../../constraints/document-category.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class DocumentCategoryRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(DocumentCategoryExistConstraint, {

    })
    @Transform(({ value }) => DocumentCategoryEntity.init(value))
    public id?: number | DocumentCategoryEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}