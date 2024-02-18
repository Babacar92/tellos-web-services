import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { EquipmentTechnicalThumbnail } from 'src/entities/psql/equipment-technical-thumbnail.entity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { EquipmentTechnicalThumbnailExistConstraint } from '../../constraints/equipment-technical-thumbnail.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class EquipmentTechnicalThumbnailRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(EquipmentTechnicalThumbnailExistConstraint, {})
  @Transform(({ value }) => EquipmentTechnicalThumbnail.init(value))
  public id?: number | EquipmentTechnicalThumbnail;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
