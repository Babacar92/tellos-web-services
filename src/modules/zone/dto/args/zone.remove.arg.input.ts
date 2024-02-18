import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { ZoneEntity } from 'src/entities/psql/ZoneEntity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { ZoneExistConstraint } from '../../constraints/zone.exist.constraint';

/**
 * Input for to create a new zone
 */
export class ZoneRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(ZoneExistConstraint, {})
  @Transform(({ value }) => ZoneEntity.init(value))
  public id?: number | ZoneEntity;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
