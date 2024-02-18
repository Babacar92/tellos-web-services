import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessDocumentTypeEntity } from "src/entities/psql/BusinessDocumentTypeEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessDocumentTypeExistConstraint } from "../../constraints/business-document-type.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessDocumentTypeRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessDocumentTypeExistConstraint, {

    })
    @Transform(({ value }) => BusinessDocumentTypeEntity.init(value))
    public id?: number | BusinessDocumentTypeEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}