import { Transform } from 'class-transformer';
import { Validate } from 'class-validator';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { UploadEntity } from '../../../../entities/psql/UploadEntity';
import { RemoveTypeItemValidate } from '../../../databases/decorators/validators/RemoveTypeItemValidate';
import { UploadExistConstraint } from '../../constraints/upload.exist.constraint';

/**
 * The request for to remove upload
 */
export class UploadRemoveArg {
  /**
   * Id of upload file
   */
  @Validate(UploadExistConstraint)
  @Transform(({ value }) => UploadEntity.init(value))
  public id?: number | UploadEntity;

  /**
   * Remove item type
   */
  @RemoveTypeItemValidate()
  public type?: REMOVE_TYPES;
}
