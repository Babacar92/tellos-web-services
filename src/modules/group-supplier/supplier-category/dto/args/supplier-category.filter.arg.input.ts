import { IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new supplier-category
 */
export class SupplierCategoryFilterArgInput extends DatabaseFilterArg {

  /**
   * The target id for filter
   */
  @IsOptional()
  @IsInt()
  public id?: number;

  /**
   * The target ids list for filter
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public ids?: number[];
  
  /**
   * The target code for filter
   */
  @IsOptional()
  @IsString()
  public name?: string;
}
