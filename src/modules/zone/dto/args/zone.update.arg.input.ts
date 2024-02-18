import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ZoneNotExistByColumnConstraint } from '../../constraints/zone.not.exist.by.column.constraints';
import { ZoneExistConstraint } from '../../constraints/zone.exist.constraint';

/**
 * Input for to update a new zone
 */
export class ZoneUpdateArgInput {
  /**
   * The id of zone
   */
  @IsNotEmpty()
  @Validate(ZoneExistConstraint, {})
  public id: number;

  /**
   * The title of code
   */
  @IsOptional()
  @IsString()
  @Validate(ZoneNotExistByColumnConstraint, {})
  public code?: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
