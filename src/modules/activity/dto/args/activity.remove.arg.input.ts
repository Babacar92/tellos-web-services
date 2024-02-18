import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { ActivityEntity } from 'src/entities/psql/ActivityEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { ActivityExistConstraint } from '../../constraints/activity.exist.constraint';

/**
 * Input for to create a new activity
 */
export class ActivityRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(ActivityExistConstraint, {})
  @Transform(({ value }) => ActivityEntity.init(value))
  public id?: number | ActivityEntity;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
