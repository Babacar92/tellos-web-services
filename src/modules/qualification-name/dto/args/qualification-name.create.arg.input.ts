import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { QualificationNameNotExistByColumnConstraint } from '../../constraints/qualification-name.not.exist.by.column.constraints';
import { QualificationTypeExistConstraint } from '../../../qualification-type/constraints/qualification-type.exist.constraint';
import { Transform } from 'class-transformer';
import { QualificationTypeEntity } from '../../../../entities/psql/QualificationTypeEntity';

/**
 * Input for to create a new Quick Access
 */
export class QualificationNameCreateArgInput {
  /**
   * The name of Qualification Name
   */
  @IsString()
  @Validate(QualificationNameNotExistByColumnConstraint, {})
  public name: string;

  /**
   * The target type
   */
  @Validate(QualificationTypeExistConstraint, {})
  @Transform(({ value }) => QualificationTypeEntity.init(value))
  public type: number | QualificationTypeEntity;

  /**
   * Validity of Qualification Name
   */
  @IsInt()
  public validity?: number;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active = true;
}
