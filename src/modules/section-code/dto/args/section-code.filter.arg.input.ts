import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Section Code
 */
export class SectionCodeFilterArgInput extends DatabaseFilterArg {
  /**
   * The expense post id
   */
  @IsOptional()
  @IsInt()
  public expensePostId?: number;

  /**
   * The expense post id
   */
  @IsOptional()
  @IsInt()
  public expensePostIds?: number[];

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
   * Check if has not expense post
   */
  @IsOptional()
  @IsBoolean()
  public hasNotExpensePost?: boolean;

  /**
   * List of ids not to be matched
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public notIds?: number[];
}
