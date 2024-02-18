import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';
import { EquipmentTechnicalGenre } from 'src/entities/psql/equipment-technical-genre.entity';
import { RemoveTypeItemValidate } from '../../../../libs/databases/decorators/validators/RemoveTypeItemValidate';
import { REMOVE_TYPES } from '../../../../libs/databases/dto/types/databases.type';
import { EquipmentTechnicalGenreExistConstraint } from '../../constraints/equipment-technical-genre.exist.constraint';

/**
 * Input for to create a new Quick Access
 */
export class EquipmentTechnicalGenreRemoveArgInput {
  /**
   * Id of upload file
   */
  @Validate(EquipmentTechnicalGenreExistConstraint, {})
  @Transform(({ value }) => EquipmentTechnicalGenre.init(value))
  public id?: number | EquipmentTechnicalGenre;

  /**
   * Remove item type
   */
  @IsOptional()
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES = REMOVE_TYPES.SOFT;
}
