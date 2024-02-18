import { IsNumber, IsString, Validate } from 'class-validator';
import { EquipmentTechnicalGenreNotExistByColumnConstraint } from '../../constraints/equipment-technical-genre.not.exist.by.column.constraints';
import { Field, Int } from '@nestjs/graphql';

/**
 * Input for to create a new equipment technical genre
 */
export class EquipmentTechnicalGenreCreateArgInput {
  /**
   * The name of equipment technical genre
   */
  @IsString()
  @Validate(EquipmentTechnicalGenreNotExistByColumnConstraint, {})
  public name!: string;
}
