import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { QualificationNameNotExistByColumnConstraint } from '../../constraints/qualification-name.not.exist.by.column.constraints';
import { QualificationNameExistConstraint } from '../../constraints/qualification-name.exist.constraint';
import { QualificationTypeExistConstraint } from '../../../qualification-type/constraints/qualification-type.exist.constraint';
import { Transform } from 'class-transformer';
import { QualificationTypeEntity } from '../../../../entities/psql/QualificationTypeEntity';

/**
 * Input for to update a new Quick Access
 */
export class QualificationNameUpdateArgInput {
  /**
   * The id of Quick Access
   */
  @IsNotEmpty()
  @Validate(QualificationNameExistConstraint, {})
  public id: number;

  /**
   * The name of Qualification Name
   */
  @IsOptional()
  @IsString()
  @Validate(QualificationNameNotExistByColumnConstraint, {})
  public name?: string;

  /**
   * The target type
   */
  @IsOptional()
  @Validate(QualificationTypeExistConstraint, {})
  @Transform(({ value }) => QualificationTypeEntity.init(value))
  public type?: number | QualificationTypeEntity;

  /**
   * Validity of Qualification Name
   */
  @IsOptional()
  @IsInt()
  public validity?: number;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
