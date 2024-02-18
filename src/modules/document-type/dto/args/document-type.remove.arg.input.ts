import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { DocumentTypeEntity } from "src/entities/psql/DocumentTypeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { DocumentTypeExistConstraint } from "../../constraints/document-type.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class DocumentTypeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(DocumentTypeExistConstraint, {

    })
    @Transform(({ value }) => DocumentTypeEntity.init(value))
    public id?: number | DocumentTypeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}