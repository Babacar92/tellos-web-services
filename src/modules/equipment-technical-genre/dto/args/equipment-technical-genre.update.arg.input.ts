import {
  IsNotEmpty,
  Validate,
  IsString,
} from 'class-validator';
import { EquipmentTechnicalGenreNotExistByColumnConstraint } from '../../constraints/equipment-technical-genre.not.exist.by.column.constraints';
import { EquipmentTechnicalGenreExistConstraint } from '../../constraints/equipment-technical-genre.exist.constraint';
import { Field, Int } from '@nestjs/graphql';

/**
 * Input for to update a new equipment technical genre
 */
export class EquipmentTechnicalGenreUpdateArgInput {
  /**
   * The id of equipment technical genre
   */
  @IsNotEmpty()
  @Validate(EquipmentTechnicalGenreExistConstraint, {})
  public id: number;


  /**
   * The name of equipment technical genre
   */
  @IsString()
  @Validate(EquipmentTechnicalGenreNotExistByColumnConstraint, {})
  public name!: string;

}
