import { IsBoolean, IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { ActivityNotExistByColumnConstraint } from '../../constraints/activity.not.exist.by.column.constraints';

/**
 * Input for to create a new activity
 */
export class ActivityCreateArgInput {
  /**
   * The code of activity
   */
  @IsString()
  @Validate(ActivityNotExistByColumnConstraint, {})
  public code: string;

  /**
   * The name of activity
   */
  @IsString()
  @Validate(ActivityNotExistByColumnConstraint, {})
  public name: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active = true;
}
