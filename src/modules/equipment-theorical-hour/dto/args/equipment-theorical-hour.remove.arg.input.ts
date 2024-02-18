import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { EquipmentTheoricalHour } from 'src/entities/psql/equipment-theorical-hour.entity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { EquipmentTheoricalHourExistConstraint } from '../../constraints/equipment-theorical-hour.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class EquipmentTheoricalHourRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(EquipmentTheoricalHourExistConstraint, {})
  @Transform(({ value }) => EquipmentTheoricalHour.init(value))
  public id?: number | EquipmentTheoricalHour;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
