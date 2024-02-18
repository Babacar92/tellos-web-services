import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Section Code
 */
export class SectionCodeFilterForWorkforceRateArgInput extends DatabaseFilterArg {

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
   * The target designation  for filter
   */
  @IsOptional()
  @IsString()
  public designation?: string;

  /**
   * The target designation for filter
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  public designations?: string[];



  /**
   * List of ids not to be matched
   */
  @IsOptional()
  @IsInt()
  public entity?: number;
}
