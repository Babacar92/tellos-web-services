import { IsBoolean, IsInt, IsOptional, IsString, Validate } from 'class-validator';
import { ZoneNotExistByColumnConstraint } from '../../constraints/zone.not.exist.by.column.constraints';

/**
 * Input for to create a new zone
 */
export class ZoneCreateArgInput {
  /**
   * The title of zone
   */
  @IsString()
  @Validate(ZoneNotExistByColumnConstraint, {})
  public code: string;

  /**
   * Is active
   */
  @IsOptional()
  @IsBoolean()
  public active = true;
}
