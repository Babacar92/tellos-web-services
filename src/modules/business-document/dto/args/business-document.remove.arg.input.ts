import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessDocumentEntity } from "src/entities/psql/BusinessDocumentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessDocumentExistConstraint } from "../../constraints/business-document.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessDocumentRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessDocumentExistConstraint, {

    })
    @Transform(({ value }) => BusinessDocumentEntity.init(value))
    public id?: number | BusinessDocumentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}