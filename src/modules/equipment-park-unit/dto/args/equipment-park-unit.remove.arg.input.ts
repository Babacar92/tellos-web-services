import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { EquipmentParkUnitEntity } from 'src/entities/psql/EquipmentParkUnitEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { EquipmentParkUnitExistConstraint } from '../../constraints/equipment-park-unit.exist.constraint';

/**
 * Input for to create a new Work Unit
 */
export class EquipmentParkUnitRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(EquipmentParkUnitExistConstraint, {})
  @Transform(({ value }) => EquipmentParkUnitEntity.init(value))
  public id?: number | EquipmentParkUnitEntity;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
