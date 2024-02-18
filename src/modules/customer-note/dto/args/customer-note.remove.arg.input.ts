import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { CustomerNoteEntity } from "src/entities/psql/CustomerNoteEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { CustomerNoteExistConstraint } from "../../constraints/customer-note.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class CustomerNoteRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(CustomerNoteExistConstraint, {

    })
    @Transform(({ value }) => CustomerNoteEntity.init(value))
    public id?: number | CustomerNoteEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}