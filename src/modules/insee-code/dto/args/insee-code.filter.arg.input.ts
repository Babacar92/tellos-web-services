import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Insee Code
 */
export class InseeCodeFilterArgInput extends DatabaseFilterArg {

  /**
   * The target code for filter
   */
  @IsOptional()
  @IsString()
  public code?: string;

  /**
   * The target codes for filter
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  public codes?: string[];

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


}
