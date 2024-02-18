import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { EquipmentFundingNotExistByColumnConstraint } from '../../constraints/equipment-funding.not.exist.by.column.constraints';
import { EquipmentFundingExistConstraint } from '../../constraints/equipment-funding.exist.constraint';

/**
 * Input for to update a new equipment funding
 */
export class EquipmentFundingUpdateArgInput {
  /**
   * The id of equipment funding
   */
  @IsNotEmpty()
  @Validate(EquipmentFundingExistConstraint, {})
  public id: number;


  /**
   * The title of equipment funding
   */
  @IsOptional()
  @IsString()
  @Validate(EquipmentFundingNotExistByColumnConstraint, {})
  public name?: string;

}
