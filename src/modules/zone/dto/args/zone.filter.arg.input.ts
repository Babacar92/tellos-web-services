import { IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new zone
 */
export class ZoneFilterArgInput extends DatabaseFilterArg {
  /**
   * The target code for filter
   */
  @IsOptional()
  @IsString()
  public code?: string;

  /**
   * The target titles for filter
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  public codes?: string[];
}
