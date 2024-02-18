import { IsString, Validate } from 'class-validator';
import { EquipmentFundingNotExistByColumnConstraint } from '../../constraints/equipment-funding.not.exist.by.column.constraints';

/**
 * Input for to create a new equipment funding
 */
export class EquipmentFundingCreateArgInput {
  /**
   * The name of equipment funding
   */
  @IsString()
  @Validate(EquipmentFundingNotExistByColumnConstraint, {})
  public name: string;
}
