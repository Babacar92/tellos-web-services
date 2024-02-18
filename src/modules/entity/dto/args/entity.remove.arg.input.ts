import { IsOptional, Validate } from "class-validator";
import { EntityEntity } from "src/entities/psql/EntityEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { EntityExistConstraint } from "../../constraints/entity.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class EntityRemoveArgInput {

    /**
     * Id of upload file
     */
    @Validate(EntityExistConstraint, {

    })
    public id?: number | EntityEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}