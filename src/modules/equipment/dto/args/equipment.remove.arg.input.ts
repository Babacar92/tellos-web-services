import { Transform } from "class-transformer";
import { IsOptional, Validate } from "class-validator";
import { EquipmentEntity } from "src/entities/psql/EquipmentEntity";
import { RemoveTypeItemValidate } from "../../../../libs/databases/decorators/validators/RemoveTypeItemValidate";
import { REMOVE_TYPES } from "../../../../libs/databases/dto/types/databases.type";
import { EquipmentExistConstraint } from "../../constraints/equipment.exist.constraint";

/**
 * Input for to remove Equipment
 */
export class EquipmentRemoveArgInput {

    /**
     * Id of Career Path
     */
    @Validate(EquipmentExistConstraint, {

    })
    @Transform(({ value }) => EquipmentEntity.init(value))
    public id?: number | EquipmentEntity;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;

}