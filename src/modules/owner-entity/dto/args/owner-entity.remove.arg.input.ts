import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { OwnerEntity } from 'src/entities/psql/owner-entity.entity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { OwnerEntityExistConstraint } from '../../constraints/owner-entity.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class OwnerEntityRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(OwnerEntityExistConstraint, {})
  @Transform(({ value }) => OwnerEntity.init(value))
  public id?: number | OwnerEntity;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
