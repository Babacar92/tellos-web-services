import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { WorkforceRateEntity } from 'src/entities/psql/WorkforceRateEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { WorkforceRateExistConstraint } from '../../constraints/workforce-rate.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class WorkforceRateRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(WorkforceRateExistConstraint, {})
  @Transform(({ value }) => WorkforceRateEntity.init(value))
  public id?: number | WorkforceRateEntity;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
