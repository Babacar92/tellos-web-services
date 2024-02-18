import { IsNumber, IsString, Validate } from 'class-validator';
import { EquipmentTechnicalThumbnailNotExistByColumnConstraint } from '../../constraints/equipment-technical-thumbnail.not.exist.by.column.constraints';
import { Field, Int } from '@nestjs/graphql';

/**
 * Input for to create a new equipment technical thumbnail
 */
export class EquipmentTechnicalThumbnailCreateArgInput {
  /**
   * The value of equipment technical thumbnail
   */
  @IsString()
  @Validate(EquipmentTechnicalThumbnailNotExistByColumnConstraint, {})
  public value!: string;
}
