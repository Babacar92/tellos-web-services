import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { CustomerDocumentEntity } from "src/entities/psql/CustomerDocumentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { CustomerDocumentExistConstraint } from "../../constraints/customer-document.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class CustomerDocumentRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(CustomerDocumentExistConstraint, {

    })
    @Transform(({ value }) => CustomerDocumentEntity.init(value))
    public id?: number | CustomerDocumentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}