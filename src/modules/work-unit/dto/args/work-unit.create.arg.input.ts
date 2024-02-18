import { IsBoolean, IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { WorkUnitNotExistByColumnConstraint } from '../../constraints/work-unit.not.exist.by.column.constraints';

/**
 * Input for to create a new Quick Access
 */
export class WorkUnitCreateArgInput {
  /**
   * The title of Quick Access
   */
  @IsString()
  @Validate(WorkUnitNotExistByColumnConstraint, {})
  public title: string;

  /**
   * The division factor
   */
  @IsOptional()
  @IsInt()
  public divisionFactor: number;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active = true;
}
