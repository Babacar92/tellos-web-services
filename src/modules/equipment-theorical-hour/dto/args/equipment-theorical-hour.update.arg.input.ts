import {
  IsNotEmpty,
  Validate,
  IsNumber,
} from 'class-validator';
import { EquipmentTheoricalHourNotExistByColumnConstraint } from '../../constraints/equipment-theorical-hour.not.exist.by.column.constraints';
import { EquipmentTheoricalHourExistConstraint } from '../../constraints/equipment-theorical-hour.exist.constraint';
import { Field, Int } from '@nestjs/graphql';

/**
 * Input for to update a new equipment theorical hour
 */
export class EquipmentTheoricalHourUpdateArgInput {
  /**
   * The id of equipment theorical hour
   */
  @IsNotEmpty()
  @Validate(EquipmentTheoricalHourExistConstraint, {})
  public id: number;


  /**
   * The title of equipment theorical hour
   */
  @IsNumber()
  @Field((type) => Int)
  @Validate(EquipmentTheoricalHourNotExistByColumnConstraint, {})
  public value!: number;

}
