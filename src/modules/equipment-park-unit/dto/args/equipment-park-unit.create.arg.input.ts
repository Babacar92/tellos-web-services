import { IsBoolean, IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { EquipmentParkUnitNotExistByColumnConstraint } from '../../constraints/equipment-park-unit.not.exist.by.column.constraints';

/**
 * Input for to create a new Work Unit
 */
export class EquipmentParkUnitCreateArgInput {
  /**
   * The title of Work Unit
   */
  @IsString()
  @Validate(EquipmentParkUnitNotExistByColumnConstraint, {})
  public title: string;

  /**
   * The division factor
   */
  @IsOptional()
  @IsInt()
  public divisionFactor: number;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active = true;
}
