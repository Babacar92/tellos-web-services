import { IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
export class QualificationNameFilterArgInput extends DatabaseFilterArg {
  /**
   * The target name for filter
   */
  @IsOptional()
  @IsString()
  public name?: string;

  /**
   * The target names for filter
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  public names?: string[];

  /**
   * The target validity for filter
   */
  @IsOptional()
  @IsInt()
  public validity?: number;

  /**
   * The target validities for filter
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public validities?: number[];

  /**
   * The target type for filter
   */
  @IsOptional()
  @IsInt()
  public type?: number;

  /**
   * The target types for filter
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public types?: number[];
}
