import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { BusinessDocumentClassificationEntity } from "src/entities/psql/BusinessDocumentClassificationEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { BusinessDocumentClassificationExistConstraint } from "../../constraints/business-document-classification.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessDocumentClassificationRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(BusinessDocumentClassificationExistConstraint, {

    })
    @Transform(({ value }) => BusinessDocumentClassificationEntity.init(value))
    public id?: number | BusinessDocumentClassificationEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}