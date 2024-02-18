import { IsNumber, IsString, Validate } from 'class-validator';
import { EquipmentTheoricalHourNotExistByColumnConstraint } from '../../constraints/equipment-theorical-hour.not.exist.by.column.constraints';
import { Field, Int } from '@nestjs/graphql';

/**
 * Input for to create a new equipment theorical hour
 */
export class EquipmentTheoricalHourCreateArgInput {
  /**
   * The value of equipment theorical hour
   */
  @IsNumber()
  @Field((type) => Int)
  @Validate(EquipmentTheoricalHourNotExistByColumnConstraint, {})
  public value!: number;
}
