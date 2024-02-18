import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { CategoryEquipmentExistConstraint } from '../../constraints/category-equipment.exist.constraint';

/**
 * Input for to remove Category equipment
 */
export class CategoryEquipmentRemoveArgInput {
    /**
     * Id of Category equipment
     */
    @Validate(CategoryEquipmentExistConstraint, {})
    @Transform(({ value }) => CategoryEquipment.init(value))
    public id?: number | CategoryEquipment;

    /**
     * Remove item type
     */
    @IsOptional()
    @RemoveTypeItemValidate()
    public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
