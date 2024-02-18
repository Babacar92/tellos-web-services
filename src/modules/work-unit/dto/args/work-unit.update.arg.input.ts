import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { WorkUnitNotExistByColumnConstraint } from '../../constraints/work-unit.not.exist.by.column.constraints';
import { WorkUnitExistConstraint } from '../../constraints/work-unit.exist.constraint';

/**
 * Input for to update a new Quick Access
 */
export class WorkUnitUpdateArgInput {
  /**
   * The id of Quick Access
   */
  @IsNotEmpty()
  @Validate(WorkUnitExistConstraint, {})
  public id: number;

  /**
   * The division factor
   */
  @IsOptional()
  @IsInt()
  public divisionFactor: number;

  /**
   * The title of Quick Access
   */
  @IsOptional()
  @IsString()
  @Validate(WorkUnitNotExistByColumnConstraint, {})
  public title?: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
