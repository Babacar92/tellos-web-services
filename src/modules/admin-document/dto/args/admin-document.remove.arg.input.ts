import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { AdminDocumentEntity } from "src/entities/psql/AdminDocumentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { AdminDocumentExistConstraint } from "../../constraints/admin-document.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class AdminDocumentRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(AdminDocumentExistConstraint, {

    })
    @Transform(({ value }) => AdminDocumentEntity.init(value))
    public id?: number | AdminDocumentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}