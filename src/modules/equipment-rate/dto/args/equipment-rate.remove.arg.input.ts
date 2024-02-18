import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { EquipmentRateEntity } from 'src/entities/psql/EquipmentRateEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { EquipmentRateExistConstraint } from '../../constraints/equipment-rate.exist.constraint';

/**
 * Input for to create a new equipment rate
 */
export class EquipmentRateRemoveArgInput {
  /**
   * Id of equipment rate
   */
  @Validate(EquipmentRateExistConstraint, {})
  @Transform(({ value }) => EquipmentRateEntity.init(value))
  public id?: number | EquipmentRateEntity;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
