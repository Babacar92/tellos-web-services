import {
  IsNotEmpty,
  Validate,
  IsString,
} from 'class-validator';
import { EquipmentTechnicalThumbnailNotExistByColumnConstraint } from '../../constraints/equipment-technical-thumbnail.not.exist.by.column.constraints';
import { EquipmentTechnicalThumbnailExistConstraint } from '../../constraints/equipment-technical-thumbnail.exist.constraint';

/**
 * Input for to update a new equipment technical thumbnail
 */
export class EquipmentTechnicalThumbnailUpdateArgInput {
  /**
   * The id of equipment technical thumbnail
   */
  @IsNotEmpty()
  @Validate(EquipmentTechnicalThumbnailExistConstraint, {})
  public id: number;


  /**
   * The title of equipment technical thumbnail
   */
  @IsString()
  @Validate(EquipmentTechnicalThumbnailNotExistByColumnConstraint, {})
  public value!: number;

}
