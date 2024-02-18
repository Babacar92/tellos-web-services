import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { EquipmentParkUnitNotExistByColumnConstraint } from '../../constraints/equipment-park-unit.not.exist.by.column.constraints';
import { EquipmentParkUnitExistConstraint } from '../../constraints/equipment-park-unit.exist.constraint';

/**
 * Input for to update a new Work Unit
 */
export class EquipmentParkUnitUpdateArgInput {
  /**
   * The id of Work Unit
   */
  @IsNotEmpty()
  @Validate(EquipmentParkUnitExistConstraint, {})
  public id: number;

  /**
   * The division factor
   */
  @IsOptional()
  @IsInt()
  public divisionFactor: number;

  /**
   * The title of Work Unit
   */
  @IsOptional()
  @IsString()
  @Validate(EquipmentParkUnitNotExistByColumnConstraint, {})
  public title?: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
