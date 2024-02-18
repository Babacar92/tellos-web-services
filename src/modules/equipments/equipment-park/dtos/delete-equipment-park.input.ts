// NestJs

//Class Validator / Transform
import { IsNumber } from 'class-validator';

//Schemas

//Constraints

/**
 * Input for to remove Category equipment
 */
export class DeleteEquipmentParkInput {
  @IsNumber()
  public id!: number;
}
