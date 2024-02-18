import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { EquipmentDocumentEntity } from "src/entities/psql/EquipmentDocumentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { EquipmentDocumentExistConstraint } from "../../constraints/equipment-document.exist.constraint";

/**
 * Input for to remove a new EquipmentDocument
 */
export class EquipmentDocumentRemoveArgInput {

    /**
     * Id of EquipmentDocument
     */
    @Validate(EquipmentDocumentExistConstraint, {

    })
    @Transform(({ value }) => EquipmentDocumentEntity.init(value))
    public id?: number | EquipmentDocumentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}