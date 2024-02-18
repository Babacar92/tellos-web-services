import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ActivityNotExistByColumnConstraint } from '../../constraints/activity.not.exist.by.column.constraints';
import { ActivityExistConstraint } from '../../constraints/activity.exist.constraint';

/**
 * Input for to update a new activity
 */
export class ActivityUpdateArgInput {
  /**
   * The id of activity
   */
  @IsNotEmpty()
  @Validate(ActivityExistConstraint, {})
  public id: number;

  /**
   * The code of activity
   */
  @IsString()
  @Validate(ActivityNotExistByColumnConstraint, {})
  public code?: string;

  /**
   * The name of activity
   */
  @IsOptional()
  @IsString()
  @Validate(ActivityNotExistByColumnConstraint, {})
  public name?: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
