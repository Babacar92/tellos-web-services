import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { WorkUnitEntity } from 'src/entities/psql/WorkUnitEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { WorkUnitExistConstraint } from '../../constraints/work-unit.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class WorkUnitRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(WorkUnitExistConstraint, {})
  @Transform(({ value }) => WorkUnitEntity.init(value))
  public id?: number | WorkUnitEntity;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
